import { PageShell } from "@/components/layout/page-shell";
import { CapabilityNote } from "@/components/workspace/capability-note";
import { ResourceList } from "@/components/workspace/resource-list";
import { getAuthSession } from "@/lib/auth";
import { loadAuthorizedCourses } from "@/lib/courses";

export default async function CoursesPage() {
  const session = await getAuthSession();
  const courses = await loadAuthorizedCourses();

  return (
    <PageShell
      title="Courses"
      description="Only authorized catalogue rows appear here. LAMLA does not invent KNUST Computer Science modules."
    >
      {!session.configured ? (
        <CapabilityNote
          title="Catalog is offline"
          description="Set the public Supabase values before course rows can be read."
        />
      ) : courses.length === 0 ? (
        <CapabilityNote
          title="No courses on file"
          description="Staff add official course rows later. This page stays empty rather than guessing codes or titles."
        />
      ) : (
        <ResourceList
          items={courses.map((course) => ({
            id: course.id,
            title: `${course.code} · ${course.title}`,
            description: `Level ${course.yearLevel} · ${course.semester}${
              course.description ? ` · ${course.description}` : ""
            }`,
          }))}
        />
      )}
    </PageShell>
  );
}
