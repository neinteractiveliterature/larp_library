import { Routes, Route } from 'react-router';
import EditProject from './EditProject';
import ProjectPage from './ProjectPage';

export default function ProjectRoot(): JSX.Element {
  return (
    <Routes>
      <Route path="edit" element={<EditProject />} />
      <Route path="/" element={<ProjectPage />} />
    </Routes>
  );
}
