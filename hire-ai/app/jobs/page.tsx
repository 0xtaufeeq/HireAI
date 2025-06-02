export default function JobsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Job Opportunities</h1>
      <div className="grid gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h2 className="text-xl font-semibold mb-4">Available Positions</h2>
          <p className="text-muted-foreground">
            No job postings available at the moment. Check back later for new opportunities.
          </p>
        </div>
      </div>
    </div>
  )
}
