import { Button, Card, Page, PageHeader } from '@summoniq/applab-ui';
import { ArrowRight, Brush, Layers, Palette } from 'lucide-react';
import Link from 'next/link';

export default function DesignPage() {
  return (
    <Page className="h-full">
      <PageHeader
        title="Design"
        description="Visual tooling for assets, layouts, and UI patterns."
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Palette className="h-4 w-4" />
                  </span>
                  <h2 className="text-sm font-semibold">Asset Designer</h2>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Build and export premium isometric assets.
                </p>
              </div>
              <Button asChild variant="outline" className="h-9">
                <Link href="/asset-designer">
                  Open
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Layers className="h-4 w-4" />
                  </span>
                  <h2 className="text-sm font-semibold">Layouts</h2>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Browse starter layout sections and composition patterns.
                </p>
              </div>
              <Button asChild variant="outline" className="h-9">
                <Link href="/layouts">
                  Open
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Brush className="h-4 w-4" />
                  </span>
                  <h2 className="text-sm font-semibold">Themes</h2>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  Experiment with palettes and styling presets.
                </p>
              </div>
              <Button asChild variant="outline" className="h-9">
                <Link href="/themes">
                  Open
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
}
