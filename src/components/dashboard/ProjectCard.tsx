
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, PlayCircle } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import StatusBadge from '@/components/ui/StatusBadge';
import { Project, getUserById } from '@/data/mockData';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  
  const projectManager = getUserById(project.projectManagerId);

  const formattedStartDate = format(new Date(project.startDate), 'MMM d, yyyy');
  const formattedEndDate = project.endDate 
    ? format(new Date(project.endDate), 'MMM d, yyyy')
    : 'Ongoing';

  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer animate-scale-in"
      onClick={() => navigate(`/projects/${project.id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
          <StatusBadge status={project.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {project.description}
        </p>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formattedStartDate}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formattedEndDate}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 text-sm border-t">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Team: {project.teamMemberIds.length + 1}</span>
          </div>
          <div className="flex items-center">
            <PlayCircle className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>PM: {projectManager?.name}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
