import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Star } from "lucide-react";

export const Route = createFileRoute("/_public/find-tutor")({
  component: FindTutor,
});

const MOCK_TUTORS = [
  { id: 1, name: "Sarah Jenkins", subject: "Mathematics", level: "A-Level", rating: 4.9, reviews: 124, price: "$45/hr", image: "https://i.pravatar.cc/150?u=sarah" },
  { id: 2, name: "Dr. Ahmed Khan", subject: "Physics", level: "University", rating: 5.0, reviews: 89, price: "$60/hr", image: "https://i.pravatar.cc/150?u=ahmed" },
  { id: 3, name: "Elena Rodriguez", subject: "Spanish", level: "GCSE", rating: 4.8, reviews: 210, price: "$35/hr", image: "https://i.pravatar.cc/150?u=elena" },
  { id: 4, name: "Michael Chen", subject: "Computer Science", level: "IGCSE", rating: 4.9, reviews: 156, price: "$50/hr", image: "https://i.pravatar.cc/150?u=michael" },
];

function FindTutor() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Find a Tutor</h1>
          <p className="text-muted-foreground mt-1">Browse our marketplace of expert tutors to find your perfect match.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b">
              <h3 className="font-semibold flex items-center gap-2"><Filter className="h-4 w-4"/> Filters</h3>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Keyword</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search name or subject..." className="pl-8" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Academic Level</label>
                <div className="flex flex-wrap gap-2">
                  {["Primary", "GCSE", "A-Level", "University"].map(lvl => (
                    <Badge key={lvl} variant="outline" className="cursor-pointer hover:bg-primary/10">{lvl}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <div className="flex flex-wrap gap-2">
                  {["Math", "Physics", "English", "Chemistry"].map(sub => (
                    <Badge key={sub} variant="outline" className="cursor-pointer hover:bg-primary/10">{sub}</Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full">Apply Filters</Button>
            </CardContent>
          </Card>
        </div>

        {/* Tutor Grid */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {MOCK_TUTORS.map((tutor) => (
              <Card key={tutor.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-muted relative">
                  <img src={tutor.image} alt={tutor.name} className="object-cover w-full h-full" />
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{tutor.name}</h3>
                    <div className="flex items-center text-sm font-medium">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      {tutor.rating}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {tutor.subject} • {tutor.level}
                  </div>
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="font-medium text-primary">{tutor.price}</span>
                    <span className="text-muted-foreground">{tutor.reviews} reviews</span>
                  </div>
                  <Button className="w-full" variant="outline">View Profile</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
