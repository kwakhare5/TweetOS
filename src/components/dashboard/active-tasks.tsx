import { MessageSquare, MoreHorizontal, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const activeTasks = [
  {
    title: "Research competitor hooks",
    description: "Analyze top 10 creators in the niche for pattern matching.",
    status: "To Do",
    tags: ["Research"],
    tagColor: "bg-orange-500/10 text-orange-700",
    comments: 2,
    users: [{ name: "Alex", avatar: "https://i.pravatar.cc/150?u=1" }]
  },
  {
    title: "Write mega-thread on AI",
    description: "15 parts. Needs strong visuals for every other tweet.",
    status: "In Progress",
    tags: ["Thread", "High Priority"],
    tagColor: "bg-red-500/10 text-red-700",
    comments: 12,
    users: [{ name: "Alex", avatar: "https://i.pravatar.cc/150?u=1" }, { name: "John", avatar: "https://i.pravatar.cc/150?u=3" }]
  }
]

export function ActiveTasks() {
  return (
    <section id="pipeline" className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Active Tasks</h2>
          <p className="text-sm text-muted-foreground">What you're working on right now.</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      <div className="grid gap-4 flex-1 h-full">
        {activeTasks.map((task, idx) => (
          <Card key={idx} className="flex flex-col cursor-pointer border border-border hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 h-5 font-medium rounded-sm border-0 ${task.tagColor}`}>
                    {task.tags[0]}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-medium rounded-sm border-muted">
                    {task.status}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 -mt-2 -mr-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <h4 className="font-semibold text-sm leading-tight">{task.title}</h4>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <p className="text-xs text-muted-foreground line-clamp-1 mb-4">
                {task.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  {task.comments > 0 && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span className="text-[10px] font-medium">{task.comments}</span>
                    </div>
                  )}
                </div>
                <div className="flex -space-x-2 overflow-hidden">
                  {task.users.map((user, i) => (
                    <Avatar key={i} className="inline-block border-2 border-background h-6 w-6">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-[8px]">{user.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
