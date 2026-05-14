interface DashboardCardProps {
  title: string;
  value: string | number;
}

export default function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="bg-[#132E4A] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-[#E68A2E] text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[#F7F7F7] text-2xl">{value}</p>
    </div>
  );
}