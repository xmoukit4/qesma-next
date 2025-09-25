import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CreateGroupForm from '@/components/groups/create-group-form';

export default function NewGroupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Group</CardTitle>
          <CardDescription>You can invite friends to your group after it has been created.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateGroupForm />
        </CardContent>
      </Card>
    </div>
  );
}
