import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, Code } from 'lucide-react';

const teamMembers = [
  { name: 'Muhammad Basit Ali', role: 'ML Engineer' },
  { name: 'Ali Hassan', role: 'Full Stack Developer' },
  { name: 'Hassam Mehmood', role: 'Backend Developer' },
];

const supervisor = {
  name: 'Dr. Farhan Hassan Khan',
  title: 'Project Supervisor',
  institution: 'The Islamia University of Bahawalpur',
  department: 'Department of Computer Science & IT',
};

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="text-center space-y-4 mb-12">
        <Badge variant="outline" className="text-primary border-primary/30">
          Our Team
        </Badge>
        <h2 className="text-3xl md:text-4xl font-bold">
          About Us
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          An advanced AI-powered phishing detection system developed with 
          cutting-edge machine learning technology
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Team */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Project Team</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Core Development Team</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {teamMembers.map((member) => (
                <div 
                  key={member.name}
                  className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Code className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Supervision */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Supervision</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Academic Guidance</p>
          </CardHeader>
          <CardContent>
            <div className="p-6 rounded-xl bg-secondary/30 text-center space-y-4">
              <p className="text-sm text-muted-foreground">Supervised By</p>
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <GraduationCap className="h-10 w-10 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{supervisor.name}</p>
                <p className="text-sm text-muted-foreground">{supervisor.title}</p>
                <p className="text-primary font-medium mt-1">{supervisor.institution}</p>
                <p className="text-sm text-muted-foreground mt-1">{supervisor.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}