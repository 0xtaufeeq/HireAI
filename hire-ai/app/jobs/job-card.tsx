interface JobCardProps {
  title: string
  company: string
  location: string
  description: string
  type: string
}

export function JobCard({ title, company, location, description, type }: JobCardProps) {
  return (
    <div className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{company}</p>
        </div>
        <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
          {type}
        </span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{location}</p>
      <p className="text-sm text-foreground line-clamp-3">{description}</p>
      <div className="flex gap-2 mt-4">
        <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          Apply Now
        </button>
        <button className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors">
          Learn More
        </button>
      </div>
    </div>
  )
}
