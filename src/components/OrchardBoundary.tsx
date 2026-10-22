import { Component, type ReactNode } from 'react';
import { websiteProjects } from '../data/websites';
/** A failed optional exhibition must not take down the branch or checkout. */
export default class OrchardBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state = {failed:false};
  static getDerivedStateFromError() { return {failed:true}; }
  render() {
    return this.state.failed ? <section className="orchard-unavailable" role="status"><h2>Explore the projects directly.</h2><p>The interactive exhibition couldn’t load. The rest of this branch is available.</p><ul>{websiteProjects.map(project=><li key={project.id}><a href={project.previewUrl} target="_blank" rel="noopener noreferrer">{project.name} ↗</a></li>)}</ul></section> : this.props.children;
  }
}
