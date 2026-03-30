import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'RACS Auto Deal API is running' });
});

// Auth API
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const staff = await prisma.staff.findFirst({
      where: { username, password }
    });
    if (staff) {
      res.json({
        id: staff.id,
        username: staff.username,
        name: staff.name,
        role: staff.role
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Staff Management API (Should be restricted to SUPER_ADMIN in production)
app.get('/api/staff', async (req: Request, res: Response) => {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch staff' });
  }
});

app.post('/api/staff', async (req: Request, res: Response) => {
  try {
    const staff = await prisma.staff.create({
      data: req.body
    });
    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create staff' });
  }
});

app.delete('/api/staff/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.staff.delete({
      where: { id: id as string }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete staff' });
  }
});

// Vehicles API
app.get('/api/cars', async (req: Request, res: Response) => {
  try {
    const cars = await prisma.vehicle.findMany({
      where: { isArchived: false },
      orderBy: { createdAt: 'desc' }
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get all cars including archived (for Admin)
app.get('/api/admin/cars', async (req: Request, res: Response) => {
  try {
    const cars = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all vehicles' });
  }
});

app.post('/api/cars', async (req: Request, res: Response) => {
  try {
    const car = await prisma.vehicle.create({
      data: req.body
    });
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

app.put('/api/cars/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const oldCar = await prisma.vehicle.findUnique({ where: { id: id as string } });
  
  try {
    const car = await prisma.vehicle.update({
      where: { id: id as string },
      data: req.body
    });

    // Notify Super Admin if status changed to 'sold'
    if (req.body.status === 'sold' && oldCar?.status !== 'sold') {
        await prisma.adminNotification.create({
            data: {
                title: 'New Sale Reported',
                message: `The vehicle "${car.name}" has been marked as sold and is pending approval for archiving.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'warning',
                sender: req.body.saleReportedBy || 'System',
                isRead: false
            }
        });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

app.post('/api/cars/:id/resolve-sale', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { action } = req.body; // 'approve' | 'reject'
    
    try {
        if (action === 'approve') {
            const car = await prisma.vehicle.update({
                where: { id: id as string },
                data: { isArchived: true, status: 'sold' }
            });
            res.json(car);
        } else {
            const car = await prisma.vehicle.update({
                where: { id: id as string },
                data: { status: 'open' } // Reset to open if rejected
            });
            res.json(car);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to resolve sale' });
    }
});

app.delete('/api/cars/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.vehicle.delete({
      where: { id: id as string }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
});

// Reports API
app.get('/api/reports', async (req: Request, res: Response) => {
  try {
    const reports = await prisma.userReport.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

app.post('/api/reports', async (req: Request, res: Response) => {
  try {
    const report = await prisma.userReport.create({
      data: req.body
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create report' });
  }
});

app.patch('/api/reports/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const report = await prisma.userReport.update({
      where: { id: id as string },
      data: req.body
    });
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update report' });
  }
});

// Settings API
app.get('/api/settings', async (req: Request, res: Response) => {
  try {
    let settings = await prisma.appSettings.findFirst();
    if (!settings) {
        // Create default settings if none exist
        settings = await prisma.appSettings.create({
            data: {
                businessName: 'Racs Auto Deal',
                contactEmail: 'contact@racsautodeal.com',
                phone: '+63 912 345 6789',
                address: 'No. 7 N.I.A. Road, Carsadang Bago 2, Imus, Cavite',
                adminPassword: 'admin123',
                sessionTimeout: 60,
                emailNotif: true,
                stockNotif: true,
                theme: 'dark',
                currency: '₱',
                vehicleTypes: ['SUV', 'Sedan', 'Electric Car', 'Hatchback', 'Van', 'Sports Car', 'Coupe']
            }
        });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', async (req: Request, res: Response) => {
  try {
    const settings = await prisma.appSettings.update({
      where: { id: 1 },
      data: req.body
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

