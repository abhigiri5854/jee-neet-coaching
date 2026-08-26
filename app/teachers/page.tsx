import type { Metadata } from "next";
import { TeacherCard } from "@/components/teachers/teacher-card";
import { getTeachers } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Teachers",
  description: "Meet PrepXpert faculty for Physics, Chemistry, Mathematics and Biology.",
};

export default async function TeachersPage() {
  const teachers = await getTeachers();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-navy">Our Teachers</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Senior faculty from IITs, AIIMS and top medical colleges.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </div>
  );
}
