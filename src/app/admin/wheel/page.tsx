import { isWheelEnabled } from "@/lib/actions/settings";
import WheelToggle from "@/components/ui/admin/wheelToggle";

export const dynamic = "force-dynamic";

export default async function AdminWheelPage() {
  const enabled = await isWheelEnabled();
  return (
    <div className="max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold mt-8">Spin the Wheel</h1>
      <p className="text-black-600">
        Turn the wheel on or off for all members. Members who already won today can still see their code.
      </p>
      <WheelToggle initial={enabled} />
    </div>
  );
}