"""Read and render inherited models in an isolated Blender process; no live scene changes."""
import bpy, math, json, struct
from pathlib import Path
from mathutils import Vector
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/fruit'
OUT.mkdir(exist_ok=True)
scene = bpy.data.scenes.new('Inherited model audit')
bpy.context.window.scene = scene
try: scene.render.engine='CYCLES'
except TypeError: pass
scene.cycles.samples=8
scene.world=bpy.data.worlds.new('Audit world'); scene.world.color=(.18,.18,.18)
camera=bpy.data.objects.new('Audit camera',bpy.data.cameras.new('Audit camera'))
scene.collection.objects.link(camera); scene.camera=camera
camera.location=(0,-20,2); camera.rotation_euler=(Vector((0,0,0))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type='ORTHO';camera.data.ortho_scale=15
for pos,power,size in [((0,-7,7),2500,8),((-7,-4,2),1500,6),((8,0,5),1800,5)]:
 d=bpy.data.lights.new('Softbox','AREA');d.energy=power;d.shape='DISK';d.size=size
 o=bpy.data.objects.new('Softbox',d);scene.collection.objects.link(o);o.location=pos;o.rotation_euler=(-o.location).to_track_quat('-Z','Y').to_euler()
report=[]
for i,p in enumerate(sorted((ROOT/'public/models').glob('*.glb'))):
 before=set(scene.objects)
 bpy.ops.import_scene.gltf(filepath=str(p))
 imported=set(scene.objects)-before
 meshes=[o for o in imported if o.type=='MESH']
 points=[o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
 lo=Vector(tuple(min(p[j] for p in points) for j in range(3)));hi=Vector(tuple(max(p[j] for p in points) for j in range(3)))
 center=(lo+hi)/2;scale=2/max(hi-lo)
 for o in imported:
  if o.parent is None:
   o.scale*=scale;o.location=(o.location-center)*scale+Vector(((i%4-1.5)*3.4,0, (1-i//4)*3.0))
 report.append({'filename':p.name,'bytes':p.stat().st_size,'meshes':len(meshes),'triangles':sum(len(o.data.polygons) for o in meshes)})
scene.render.resolution_x=1200;scene.render.resolution_y=850;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.filepath=str(OUT/'inherited-audit.png')
bpy.ops.render.render(write_still=True)
(OUT/'inherited-audit.json').write_text(json.dumps(report,indent=2))
