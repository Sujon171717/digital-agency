import { ProjectDetail } from "@/components/ProjectDetail";

export default async function Page({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  return <ProjectDetail id={id} />;
}
