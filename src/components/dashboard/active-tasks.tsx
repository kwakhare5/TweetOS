import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

// ... existing imports ...
import { MessageSquare, MoreHorizontal, Plus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

import { ACTIVE_TASKS } from "@/data/mock-data"
export function ActiveTasks() {
  return (
    <section id="pipeline" className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Active Tasks</h2>
          <p className="text-sm text-muted-foreground">What you&apos;re working on right now.</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
      <div className="grid gap-4 flex-1 h-full">
        {ACTIVE_TASKS.map((task, idx) => (
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
                <div className="flex -space-x-2 overflow-visible">
                  {task.users.map((user, i) => (
                    <HoverCard key={i}>
                      <HoverCardTrigger render={
                        <Avatar className="inline-block border-2 border-background h-6 w-6 transition-transform hover:scale-125 hover:z-10 cursor-pointer">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-[8px]">{user.name[0]}</AvatarFallback>
                        </Avatar>
                      } />
                      <HoverCardContent className="w-80 z-50">
                        <div className="flex justify-between space-x-4">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">@{user.name.toLowerCase()}</h4>
                            <p className="text-sm text-muted-foreground">
                              Content strategist and ghostwriter.
                            </p>
                            <div className="flex items-center pt-2">
                              <span className="text-xs text-muted-foreground">
                                Active on 12 drafts
                              </span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
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
