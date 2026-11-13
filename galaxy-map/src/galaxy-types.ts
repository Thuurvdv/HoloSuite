export type GalaxyVisibility = "gm" | "players";
export type LocationVisibility = GalaxyVisibility | "inherit";

export interface GalaxyOrbit {
  id: string;
  radius: number;
}

export interface GalaxyOrbitAttachment {
  centerId: string;
  orbitId: string;
  angle: number;
  period: number;
  clockwise: boolean;
  epoch: number;
}

export interface GalaxyLocation {
  id: string;
  name: string;
  kind: string;
  x: number;
  y: number;
  status: string;
  visibility: LocationVisibility;
  factionId: string;
  description: string;
  notes: string;
  sceneIds: string[];
  planetLocations: unknown[];
  orbits?: GalaxyOrbit[];
  orbit?: GalaxyOrbitAttachment;
  [key: string]: any;
}

export interface GalaxyRoute {
  id: string;
  fromSystemId: string;
  toSystemId: string;
  type: string;
  travelTime: string;
  fuelCost: number;
  visibility: GalaxyVisibility;
  notes: string;
}

export interface GalaxySystem {
  id: string;
  name: string;
  x: number;
  y: number;
  status: string;
  visibility: GalaxyVisibility;
  objects: GalaxyLocation[];
  routes: GalaxyRoute[];
  primaryObjectId: string;
  [key: string]: any;
}

export interface GalaxyMap {
  id: string;
  title: string;
  systems: GalaxySystem[];
  routes: GalaxyRoute[];
  factions: unknown[];
  currentSystemId: string;
  [key: string]: any;
}
