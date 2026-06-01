import { Page, PageHeader } from '@summoniq/applab-ui';

export default function HomePage() {
  return (
    <Page className="h-full">
      <PageHeader
        title="Designer Dashboard"
        description="Create, edit, and ship pages from your SummonIQ projects."
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Start</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Start with a project, then jump into the studio:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-primary">→</span>
                  <span>
                    <strong>Projects</strong> - Pick an app and browse pages
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">→</span>
                  <span>
                    <strong>Studio</strong> - Design and edit screens
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">→</span>
                  <span>
                    <strong>Design</strong> - Explore assets, layouts, and themes
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
