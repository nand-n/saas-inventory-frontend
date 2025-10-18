import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { Employee } from '@/types/hr.types';
import { FilterOptions } from '@/types/common.type';

interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  terminated: number;
  averageSalary: number;
  totalSalary: number;
  newHiresThisMonth: number;
}

interface EmployeeStore {
  employees: Employee[];
  filteredEmployees: Employee[];
  isLoading: boolean;
  filters: FilterOptions;
  stats: EmployeeStats;
  fetchEmployees: () => Promise<void>;
  addEmployee: (employee: Partial<Employee>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  bulkDeleteEmployees: (ids: string[]) => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  calculateStats: () => void;
}

export const useEmployeeStore = create<EmployeeStore>((set, get) => ({
  employees: [],
  filteredEmployees: [],
  isLoading: false,
  filters: {},
  stats: {
    total: 0,
    active: 0,
    inactive: 0,
    terminated: 0,
    averageSalary: 0,
    totalSalary: 0,
    newHiresThisMonth: 0,
  },

  fetchEmployees: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/employees');
      set({ employees: res.data });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addEmployee: async (employeeData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post('/employees', employeeData);
      const { employees } = get();
      const updatedEmployees = [...employees, res.data];
      set({ employees: updatedEmployees });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error adding employee:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateEmployee: async (id, employeeData) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.patch(`/employees/${id}`, employeeData);
      const { employees } = get();
      const updatedEmployees = employees.map(emp =>
        emp.id === id ? res.data : emp
      );
      set({ employees: updatedEmployees });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error updating employee:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteEmployee: async (id) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/employees/${id}`);
      const { employees } = get();
      const updatedEmployees = employees.filter(emp => emp.id !== id);
      set({ employees: updatedEmployees });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error deleting employee:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  bulkDeleteEmployees: async (ids) => {
    set({ isLoading: true });
    try {
      await axiosInstance.post('/employees/bulk-delete', { ids });
      const { employees } = get();
      const updatedEmployees = employees.filter(emp => !ids.includes(emp.id));
      set({ employees: updatedEmployees });
      get().applyFilters();
      get().calculateStats();
    } catch (error) {
      console.error('Error bulk deleting employees:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  setFilters: (filters) => {
    set({ filters });
    get().applyFilters();
  },

  clearFilters: () => {
    set({ filters: {} });
    get().applyFilters();
  },

  applyFilters: () => {
    const { employees, filters } = get();
    let filtered = [...employees];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm) ||
        emp.email.toLowerCase().includes(searchTerm) ||
        emp.jobTitle.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filtered = filtered.filter(emp => emp.status === filters.status);
    }

    if (filters.position) {
      filtered = filtered.filter(emp => emp.jobTitle === filters.position);
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(emp => emp.hireDate >= filters.dateFrom!);
    }

    if (filters.dateTo) {
      filtered = filtered.filter(emp => emp.hireDate <= filters.dateTo!);
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[filters.sortBy as keyof Employee];
        const bValue = b[filters.sortBy as keyof Employee];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filters.sortOrder === 'desc'
            ? bValue.localeCompare(aValue)
            : aValue.localeCompare(bValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return filters.sortOrder === 'desc'
            ? bValue - aValue
            : aValue - bValue;
        }

        return 0;
      });
    }

    set({ filteredEmployees: filtered });
  },

calculateStats: () => {
  const { employees } = get();

  const total = employees.length;
  const active = employees.filter(emp => emp.status === 'active').length;
  const inactive = employees.filter(emp => emp.status === 'inactive').length;
  const terminated = employees.filter(emp => emp.status === 'terminated').length;

  // Convert salary to number
  const totalSalary = employees.reduce(
    (sum, emp) => sum + (emp?.salary ? Number(emp.salary) : 0),
    0
  );

  const averageSalary = total > 0 ? totalSalary / total : 0;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newHiresThisMonth = employees.filter(emp => {
    const hireDate = new Date(emp.hireDate);
    return hireDate.getMonth() === currentMonth && hireDate.getFullYear() === currentYear;
  }).length;

  set({
    stats: {
      total,
      active,
      inactive,
      terminated,
      averageSalary,
      totalSalary,
      newHiresThisMonth,
    },
  });
},

}));
