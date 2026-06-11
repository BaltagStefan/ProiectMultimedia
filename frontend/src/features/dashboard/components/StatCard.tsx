import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function StatCard({ icon: Icon, value, label, trend, tone = "blue" }: {
  icon: LucideIcon;
  value: string;
  label: string;
  trend: string;
  tone?: "blue" | "green" | "orange" | "violet";
}) {
  return (
    <motion.div className={`glass-card stat-card tone-${tone}`} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <div className="stat-icon"><Icon /></div>
      <div><strong>{value}</strong><span>{label}</span></div>
      <small>{trend}</small>
    </motion.div>
  );
}

