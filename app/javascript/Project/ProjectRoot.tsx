import { Routes, Route } from 'react-router';
import EditProject from './EditProject';
import NewProject from './NewProject';
import ProjectPage from './ProjectPage';

export default function ProjectRoot(): JSX.Element {
  return (
    <Routes>
      <Route path="/:projectId/edit" element={<EditProject />} />
      <Route path="/:projectId" element={<ProjectPage />} />
      <Route path="new" element={<NewProject />} />
    </Routes>
  );
}
