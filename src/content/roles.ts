import type { Role, RoleId } from "../engine/types";

// Perks stay small (one point) so the role adds flavour without deciding the game.
// Facts must be checked against NASA or ESA sources before release.
export const ROLES: Role[] = [
  {
    id: "engineer",
    name: "Engineer",
    icon: "wrench",
    oneLiner: "Fixes machines and keeps the power on.",
    perk: { kind: "repairDiscount", power: 1 },
    perkText: "Digs 5 extra litres of water when mining ice.",
    fact: "Astronauts on the Space Station fix their own equipment, from air machines to the toilet.",
  },
  {
    id: "doctor",
    name: "Doctor",
    icon: "medical",
    oneLiner: "Keeps the crew healthy and safe.",
    perk: { kind: "shelterDiscount", supplies: 1 },
    perkText: "Exercise gives the crew 2 extra health.",
    fact: "Astronauts check their own health in space, and doctors on Earth watch over them.",
  },
  {
    id: "scientist",
    name: "Scientist",
    icon: "flask",
    oneLiner: "Studies rocks, plants and the sky.",
    perk: { kind: "scienceBonus", science: 1 },
    perkText: "Research and spacewalks give 1 extra science.",
    fact: "Crews on the Space Station have run thousands of experiments.",
  },
];

export function getRole(id: RoleId): Role {
  const role = ROLES.find((r) => r.id === id);
  if (!role) throw new Error(`Unknown role: ${id}`);
  return role;
}

export const PRESET_NAMES = ["Nova", "Orion", "Luna", "Rio", "Sky", "Kai", "Zara", "Max"];
