const StatsSection = () => {
  const stats = [
    { value: "15,000+", label: "Meals Donated" },
    { value: "350+", label: "Active Donors" },
    { value: "120+", label: "Partner Organizations" }
  ];

  return (
    <section className="bg-white py-12 shadow-inner">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-lg text-neutral-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
