import { Request, Response } from "express";
import { GetRoutesService } from "../../../core/application/services/getRoutes";
import { SetBaselineService } from "../../../core/application/services/setBaseline";
import { RoutesRepository } from "../../outbound/postgres/RoutesRepository";

const routesRepo = new RoutesRepository();
const getRoutes = new GetRoutesService(routesRepo);
const setBaseline = new SetBaselineService(routesRepo);

export async function getRoutesHandler(req: Request, res: Response) {
  const { vesselType, fuelType, year } = req.query;
  const routes = await getRoutes.execute({
    vesselType: vesselType as string,
    fuelType: fuelType as string,
    year: year ? Number(year) : undefined,
  });
  res.json(routes);
}

export async function setBaselineHandler(req: Request, res: Response) {
  try {
    const { code } = req.params;
    await setBaseline.execute(code);
    res.json({ message: "Baseline updated" });
  } catch (error) {
    if (error instanceof Error && error.message.includes("not found")) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
