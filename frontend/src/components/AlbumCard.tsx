import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface AlbumCardProps {
  image: string;
  name: string;
  desc: string;
  id: string;
}

const AlbumCard: React.FC<AlbumCardProps> = ({ image, name, desc, id }) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate("/album/" + id)}
      className="min-w-[180px] p-3 rounded-md border-none cursor-pointer bg-transparent hover:bg-[#ffffff1a] transition-colors"
    >
      <img
        src={image}
        alt={name}
        className="rounded-md w-[160px] h-[160px] object-cover"
      />
      <div className="mt-0">
        <p className="font-bold text-white">{name.slice(0, 12)}...</p>
        <p className="text-slate-400 text-sm">{desc.slice(0, 18)}...</p>
      </div>
    </Card>
  );
};

export default AlbumCard;
