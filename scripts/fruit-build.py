"""Rebuild StarrFruit with Blender 5.2: blender -b --python scripts/fruit-build.py.
Runs in a separate Blender process. Frequencies are symbolic, not simulations.
Two inherited meshes are reused; five new forms use simple optical membranes.
"""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]; OUT=ROOT/'public/fruit'; OUT.mkdir(exist_ok=True)
WORLDS=[('web',(1,.10,.16)),('art',(1,.32,.06)),('ai',(1,.69,.10)),('education',(.1,1,.45)),('music',(.10,.48,1)),('ventures',(.32,.25,1)),('wisdom',(.73,.26,1))]
REUSE={'art':'Meshy_AI_Liquid_Diamond_0804231912_texture-optimized_qeygwd.glb','ventures':'Meshy_AI_Prismatic_Diamond_0804231813_texture-optimized_rem9i7.glb'}
def material(name,color,glass=False):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=next(n for n in m.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
 for k,v in {'Base Color':(*color,1),'Metallic':.08 if glass else .25,'Roughness':.10,'Transmission Weight':.87 if glass else 0,'Coat Weight':1,'IOR':1.46,'Emission Color':(*color,1),'Emission Strength':.025 if glass else 1.2,'Thin Film Thickness':430}.items():
  p.inputs[k].default_value=v
 return m
def mesh(name,verts,faces,mat):
 d=bpy.data.meshes.new(name);d.from_pydata(verts,[],faces);d.update();o=bpy.data.objects.new(name,d);bpy.context.scene.collection.objects.link(o);o.data.materials.append(mat)
 for p in d.polygons:p.use_smooth=True
 return o
def torus(name,major,minor,mat,wave=0,lobes=5):
 nu,nv=96,16;v=[];f=[]
 for i in range(nu):
  u=i*math.tau/nu
  for j in range(nv):
   t=j*math.tau/nv;r=major+wave*math.cos(lobes*u)+minor*math.cos(t)
   v.append((r*math.cos(u),r*math.sin(u),minor*math.sin(t)+wave*.7*math.sin(lobes*u)))
 for i in range(nu):
  for j in range(nv): f.append((i*nv+j,((i+1)%nu)*nv+j,((i+1)%nu)*nv+(j+1)%nv,i*nv+(j+1)%nv))
 return mesh(name,v,f,mat)
def light(scene,pos,color,power,size):
 d=bpy.data.lights.new('Softbox','AREA');d.energy=power;d.color=color;d.size=size;d.shape='DISK'
 o=bpy.data.objects.new('Softbox',d);scene.collection.objects.link(o);o.location=pos;o.rotation_euler=(-o.location).to_track_quat('-Z','Y').to_euler()
report=[]
for wid,color in WORLDS:
 s=bpy.data.scenes.new('StarrFruit — '+wid);bpy.context.window.scene=s
 try:s.render.engine='CYCLES'
 except TypeError:pass
 s.cycles.samples=24;s.cycles.use_denoising=True;s.render.film_transparent=True
 s.world=bpy.data.worlds.new(wid+' studio');s.world.color=(.12,.15,.22)
 glass=material(wid+' optical membrane',tuple(.20+c*.80 for c in color),True);core=material(wid+' inner energy',color)
 if wid in REUSE:
  bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/models'/REUSE[wid]))
  objs=[o for o in s.objects if o.type=='MESH'];pts=[o.matrix_world@Vector(c) for o in objs for c in o.bound_box]
  lo=Vector(tuple(min(p[j] for p in pts) for j in range(3)));hi=Vector(tuple(max(p[j] for p in pts) for j in range(3)));center=(lo+hi)/2;scale=2.8/max(hi-lo)
  for o in objs:
   o.location=(o.location-center)*scale;o.scale*=scale;o.data.materials.clear();o.data.materials.append(glass)
   bpy.context.view_layer.objects.active=o;o.select_set(True)
   mod=o.modifiers.new('Web geometry budget','DECIMATE');mod.ratio=min(1,5500/len(o.data.polygons));bpy.ops.object.modifier_apply(modifier=mod.name)
  torus('Inner orbit',.65,.035,core).rotation_euler=(math.pi/2,0,0)
 elif wid=='music':
  for i,(r,t) in enumerate([(1.13,.24),(.72,.10),(.38,.075)]):
   o=torus('Resonance membrane '+str(i),r,t,glass if i<2 else core,wave=.035,lobes=12);o.rotation_euler=(math.pi/2+.22,.16,0)
 elif wid=='web':
  for i in range(3):
   o=torus('Root lattice '+str(i),1.0,.16,glass,wave=.20,lobes=4);o.rotation_euler=(math.pi/2,i*math.pi/3,math.pi/4)
  torus('Root energy',.6,.06,core).rotation_euler=(math.pi/2,0,0)
 elif wid=='ai':
  for i in range(3):
   o=torus('Gyroscope '+str(i),1.08-i*.15,.11,glass);o.rotation_euler=(math.pi/2,i*math.pi/3,.3)
  torus('Solar nucleus',.3,.21,core).rotation_euler=(math.pi/2,0,0)
 elif wid=='education':
  for i in [-1,1]:
   o=torus('Shared orbit '+str(i),.76,.19,glass,wave=.07,lobes=3);o.rotation_euler=(math.pi/2,.2,i*.5);o.location.x=i*.38
  torus('Connection',.4,.09,core).rotation_euler=(math.pi/2,0,0)
 elif wid=='wisdom':
  for i in range(5):
   o=torus('Crown lens '+str(i),.34+math.sin(i/4*math.pi)*.64,.105,glass);o.location.z=(i-2)*.34;o.rotation_euler=(.35,0,0)
  torus('Inner aperture',.55,.05,core).rotation_euler=(math.pi/2,0,0)
 # Web coordinate system uses Y up; Blender exports the conversion automatically.
 geometry=[o for o in s.objects if o.type=='MESH']
 for o in s.objects:o.select_set(o in geometry)
 bpy.ops.export_scene.gltf(filepath=str(OUT/(wid+'.glb')),use_selection=True,use_active_scene=True,export_cameras=False,export_lights=False)
 camera=bpy.data.objects.new('Poster camera',bpy.data.cameras.new('Poster camera'));s.collection.objects.link(camera);s.camera=camera
 camera.location=(.35,-6.5,2.25);camera.rotation_euler=(-camera.location).to_track_quat('-Z','Y').to_euler();camera.data.type='ORTHO';camera.data.ortho_scale=3.9
 light(s,(-3,-4,5),(.64,.82,1),950,3);light(s,(4,1,2),(1,.5,.75),1350,2);light(s,(0,-3,-3),color,750,2)
 s.render.resolution_x=640;s.render.resolution_y=640;s.render.resolution_percentage=100;s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.render.filepath=str(OUT/(wid+'.png'))
 bpy.ops.render.render(write_still=True)
 report.append({'id':wid,'modelBytes':(OUT/(wid+'.glb')).stat().st_size,'posterBytes':(OUT/(wid+'.png')).stat().st_size,'source':REUSE.get(wid,'new Blender membrane geometry')})
bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'starrfruit-source.blend'))
(OUT/'build-report.json').write_text(json.dumps(report,indent=2))
