import { z } from 'zod';

export const VehicleSchema = z.object({
  id: z.string(),
  name: z.string(),
  serialNumber: z.string().nullable(),
  vin: z.string().nullable(),
  plate: z.string().nullable(),
  groupsId: z.array(z.string()),
  distance: z.number(),
  idleFuelUsed: z.number(),
  fuelUsed: z.number(),
  co2: z.number(),
  performance: z.number(),
  idlingTime: z.number(),
  drivingTime: z.number(),
  fuelPrice: z.number(),
  fuelLevel: z.number(),
});

export const FleetAnalysisOutputSchema = z.array(
  z.object({
    id: z.string(),
    aiRecommendation: z.string(),
    category: z.enum(['EV Candidate', 'Top Performer', 'High Waste', 'Normal']),
    estimatedWasteCost: z.number(),
    icon: z.string(),
    geotabAction: z.string(),
  }),
);
