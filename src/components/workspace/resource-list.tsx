import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ResourceListItem = {
  id: string;
  title: string;
  description: string;
};

type ResourceListProps = {
  items: ResourceListItem[];
};

export function ResourceList({ items }: ResourceListProps) {
  return (
    <div className="grid gap-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
