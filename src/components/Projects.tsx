import React, { useState, useEffect } from "react";
import { getProjects } from "@/services/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

const Projects = () => {
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectsData = async () => {
      try {
        const data = await getProjects();
        setProjectsList(data as ProjectItem[]);
      } catch (error) {
        console.error("Error fetching projects data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsData();
  }, []);

  // Fallback data in case Firebase isn't configured yet
  const fallbackData: ProjectItem[] = [
    {
      id: "1",
      title:
        "Design, development and deploiement of a Web application dedicated to managing annual employee interviews",
      description:
        "Designed, developed, and deployed a web application for managing annual employee interviews, tailored to the company’s hierarchical structure. The system models interview processes using BPMN concepts and automates workflows for smoother management. It ensures structured interview tracking and reduces manual interventions. The solution improves efficiency by minimizing administrative workload. Overall, it enhances accuracy and reduces human errors in HR operations.",
      imageUrl: "../images/pfeCycle.PNG",
      technologies: [
        "Angular",
        "TypeScript",
        "Spring boot",
        "Camunda",
        "BPMN",
        "PostgreSQL",
        "Docker",
        "Agile Scrum",
      ],
      liveUrl: "https://example.com/ecommerce",
      githubUrl: "https://github.com/username/ecommerce",
      featured: true,
    },
    {
      id: "2",
      title:
        "Design and development of a web application dedicated to restaurant management.",
      description:
        "Designed and developed a web application dedicated to restaurant management, offering centralized control over menus, reservations, and user accounts. The system includes real-time order tracking to enhance service responsiveness. It streamlines the ordering process, ensuring faster and more accurate service. The platform improves overall efficiency in restaurant operations. Its user-friendly interface enhances the customer experience.",
      imageUrl: "../images/stage ete.PNG",
      technologies: [
        "Laravel",
        "Vue js",
        "MySQL",
        "Atomic Design",
        "Agile Scrum",
      ],
      liveUrl: "https://example.com/taskmanager",
      githubUrl: "https://github.com/username/taskmanager",
      featured: true,
    },
    {
      id: "3",
      title:
        "Design and development of a Web and mobile module integrated into the ERP of ISET Sfax.",
      description:
        "Developed a graphical interface for managing teacher attendance across departments. The system allows monitoring of absences and tracking of catch-up sessions. It centralizes data to improve accessibility and ensure transparency. This solution simplifies administrative follow-up and enhances coordination.",
      imageUrl: "../images/pfeLicence.PNG",
      technologies: [
        "Spring boot",
        "Angular",
        "Ionis",
        "Chart.js",
        "Jaspert report",
        "SQL Server",
        "MySQL",
      ],
      githubUrl: "https://github.com/username/weather-app",
      featured: false,
    },
    {
      id: "4",
      title: "Developed a web and mobile application as part of an ERP system.",
      description:
        "Focused on personnel payroll management. The solution enables secure management of employee salaries, bonuses, and deductions. It ensures accurate payroll calculations while complying with legal and organizational rules. Real-time access via mobile enhances flexibility for HR teams. The system also generates detailed reports for audits and administrative purposes.",
      imageUrl: "../images/pfa.PNG",
      technologies: [
        "React",
        "Asp.net",
        "React material",
        "Flutter",
        "SQL Server",
      ],
      liveUrl: "https://example.com/portfolio-gen",
      githubUrl: "https://github.com/username/portfolio-generator",
      featured: true,
    },
  ];

  const displayData = projectsList.length > 0 ? projectsList : fallbackData;

  // Sort to display featured projects first
  const sortedProjects = [...displayData].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <section id="projects" className="py-24 bg-portfolio-light-gray">
      <div className="section-container animate-fade-in">
        <h2 className="section-title text-portfolio-blue">
          Academic and Personal Projects
        </h2>
        <p className="section-subtitle">
          A selection of my recent development work
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {sortedProjects.map((project, index) => (
            <Card
              key={project.id}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                {project.featured && (
                  <span className="absolute top-2 right-2 bg-portfolio-blue text-white text-xs px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>

              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-portfolio-dark-blue mb-2">
                  {project.title}
                </h3>
                <p className="text-portfolio-dark-gray mb-4">
                  {project.description}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-portfolio-light-gray text-portfolio-dark-gray"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 mt-6">
                  {project.liveUrl && (
                    <Button
                      variant="default"
                      className="bg-portfolio-blue hover:bg-portfolio-dark-blue"
                      asChild
                    >
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        <ExternalLink className="mr-1 h-4 w-4" /> Live Demo
                      </a>
                    </Button>
                  )}

                  {project.githubUrl && (
                    <Button
                      variant="outline"
                      className="border-portfolio-blue text-portfolio-blue hover:bg-portfolio-blue hover:text-white"
                      asChild
                    >
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center"
                      >
                        <Github className="mr-1 h-4 w-4" /> Code
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
