<template>
  <div class="bg-zinc-100 flex flex-col gap-4 min-[480px]:gap-6 items-center justify-center p-2 relative min-h-screen">
    <!-- Error message display -->
    <div v-if="error" class="w-full max-w-[calc(100%-1rem)] min-[480px]:w-[448px] bg-red-50 border border-red-200 rounded-md p-4 mb-4">
      <p class="text-red-800 font-semibold mb-2">Error loading employee data</p>
      <p class="text-red-700 text-sm">{{ error }}</p>
    </div>
    
    <div class="flex flex-col justify-center relative text-[#121212] text-xs min-[480px]:text-sm text-center tracking-[-0.3px] px-2 w-full">
      <p class="leading-5 min-[480px]:leading-6 text-base min-[480px]:text-lg whitespace-normal min-[480px]:whitespace-pre break-words">
        Randomly displays 1 of the 32,381 <a target="_blank" href="https://data.cityofchicago.org/" class="underline">City of Chicago</a> employees
      </p>
    </div>
    <div class="flex gap-4 min-[480px]:gap-8 items-center justify-center relative w-full" data-name="card">
      <div class="card-container w-full max-w-[calc(100%-1rem)] min-[480px]:w-[448px] h-64" :class="{ 'flipped': isFlipped }">
        <div class="card-front">
          <div class="bg-white border border-gray-300 relative rounded-md w-full h-full" data-name="business-card-front">
            <div class="h-full shadow-md overflow-clip relative rounded-[inherit] w-full">
              <!-- Loading state: show only loading indicator -->
              <template v-if="!isNameReady">
                <div class="absolute flex flex-col gap-1.5 min-[480px]:gap-2 items-start left-20 min-[480px]:left-[127px] text-[#121212] top-1/2 translate-y-[-50%] right-12 min-[480px]:right-auto" data-name="name+role">
                  <div class="flex flex-col employee-name font-extrabold justify-center relative tracking-[-0.2px] w-full">
                    <p class="leading-7 min-[480px]:leading-[29px] text-3xl min-[480px]:text-4xl text-gray-400 animate-pulse">Loading...</p>
                  </div>
                </div>
              </template>
              
              <!-- Data ready: show all fields together -->
              <template v-else>
                <div class="absolute flex flex-col gap-1.5 min-[480px]:gap-2 items-start left-20 min-[480px]:left-[127px] text-[#121212] top-1/2 translate-y-[-50%] right-12 min-[480px]:right-auto" data-name="name+role">
                  <div class="flex flex-col employee-name font-extrabold justify-center relative tracking-[-0.2px] w-full">
                    <Transition name="fade" mode="out-in">
                      <p :key="`name-${employeeKey}`" class="leading-7 min-[480px]:leading-[29px] text-3xl min-[480px]:text-4xl">
                        <span v-if="firstName" class="employee-name font-extrabold">{{ firstName }}</span>
                        <span v-if="firstName && lastName">&nbsp;</span>
                        <span v-if="lastName" class="employee-name font-medium">{{ lastName }}</span>
                      </p>
                    </Transition>
                  </div>
                  <div class="capitalize flex flex-col italic justify-center relative text-lg tracking-[-0.3px] w-full">
                    <Transition name="fade" mode="out-in">
                      <p v-if="jobTitle" :key="`title-${employeeKey}`" class="leading-5 min-[480px]:leading-6">{{ jobTitle }}</p>
                    </Transition>
                  </div>
                </div>
                <div class="absolute bottom-4 min-[480px]:bottom-6 capitalize flex flex-col font-medium justify-end left-20 min-[480px]:left-[127px] text-[#121212] text-base min-[480px]:text-lg tracking-[-0.3px] right-12 min-[480px]:right-auto min-[480px]:w-[305px]" data-name="department">
                  <Transition name="fade" mode="out-in">
                    <p v-if="department" :key="`dept-${employeeKey}`" class="leading-5 min-[480px]:leading-6 mb-0">{{ department }}</p>
                  </Transition>
                </div>
              </template>
              
              <div class="absolute h-32 min-[480px]:h-[208px] left-4 min-[480px]:left-6 top-1/2 translate-y-[-50%] w-12 min-[480px]:w-[71px]" data-name="CHI-vertical">
                <img alt="City of Chicago Logo" class="absolute inset-0 object-center object-contain size-full" :src="imgChiVertical" />
              </div>
              <div class="absolute right-3 min-[480px]:right-4 top-3 min-[480px]:top-4 flex gap-2 items-center">
                <div class="size-8 min-[480px]:size-9 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-gray-100 active:bg-gray-200 rounded-lg p-1" @click="refreshEmployee" data-name="UserSwitch">
                  <img alt="Change user" class="block size-full transition-opacity duration-300 hover:opacity-80 active:opacity-60" :src="imgUserSwitch" />
                </div>
                <div class="size-8 min-[480px]:size-9 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 hover:rotate-180 hover:bg-gray-100 active:bg-gray-200 rounded-lg p-1" @click="toggleFlip" data-name="ArrowsCounterClockwise">
                  <img alt="Refresh" class="block size-full transition-opacity duration-300 hover:opacity-80 active:opacity-60" :src="imgArrowsCounterClockwise" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-back">
          <div class="bg-white border border-gray-300 shadow-md relative rounded-md w-full h-full" data-name="business-card-back">
            <div class="h-full overflow-clip relative rounded-[inherit] w-full flex items-center justify-center">
              <div v-if="isFlipped && isNameReady" class="flex flex-col gap-4 items-center relative max-w-[255px] min-[480px]:max-w-none">
                <div class="flex flex-col employee-name font-extrabold justify-center relative text-[#e71a40] text-5xl min-[480px]:text-[72px] text-center tracking-tight">
                  <p class="leading-[1.2]">✶✶✶✶</p>
                </div>
                <div class="flex flex-col employee-name font-extrabold justify-center relative text-[#121212] text-3xl min-[480px]:text-4xl text-center tracking-[-0.2px]">
                  <Transition name="fade" mode="out-in">
                    <p v-if="firstName && lastName" :key="`name-back-${employeeKey}`" class="leading-[29px]">
                      <span class="employee-name font-extrabold">{{ firstName }}</span> <span class="employee-name font-medium">{{ lastName }}</span>
                    </p>
                  </Transition>
                </div>
                <div class="capitalize flex flex-col gap-1 items-center justify-center relative text-[#121212] text-base tracking-[-0.3px]">
                  <Transition name="fade" mode="out-in">
                    <div v-if="employeeType" :key="`type-${employeeKey}`">
                      <p class="leading-5 whitespace-pre">{{ employeeType }}</p>
                    </div>
                  </Transition>
                  <Transition name="fade" mode="out-in">
                    <div v-if="isHourly ? hourlyRate : salary" :key="`compensation-${employeeKey}`">
                      <p class="leading-5 whitespace-pre">
                        <span v-if="isHourly">Hourly Rate:</span>
                        <span v-else>Annual Salary:</span>
                        <span>&nbsp;{{ isHourly ? hourlyRate : salary }}</span>
                      </p>
                    </div>
                  </Transition>
                </div>
              </div>
              <div class="absolute right-3 min-[480px]:right-4 top-3 min-[480px]:top-4 flex gap-2 items-center">
                <div class="size-8 min-[480px]:size-9 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 hover:rotate-180 hover:bg-gray-100 active:bg-gray-200 rounded-lg p-1" @click="toggleFlip" data-name="ArrowsCounterClockwise">
                  <img alt="Refresh" class="block size-full transition-opacity duration-300 hover:opacity-80 active:opacity-60" :src="imgArrowsCounterClockwise" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col justify-center relative text-[#121212] tracking-[-0.3px] px-2">
      <p class="leading-5 min-[480px]:leading-6 text-sm min-[480px]:text-lg whitespace-pre-wrap min-[480px]:whitespace-pre text-center">
        <span>Data from </span>
        <a target="_blank" href="https://data.gov/" class="underline">data.gov,</a>
        <span> served via Supabase</span> | <span> Made by </span><a target="_blank" href="https://bradsiefert.com/" class="underline">this guy</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';

const imgChiVertical = "/chicago-logo-vertical.png";
const imgArrowsCounterClockwise = "/ArrowsCounterClockwise.svg";
const imgUserSwitch = "/UserSwitch.svg";

const isFlipped = ref(false);
const employee = ref<any>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const employeeKey = ref(0); // Used to force transitions on data updates

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value;
};

const fetchEmployee = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await $fetch<{ success: boolean; data?: any }>('/api/employee');
    
    if (response.success && response.data) {
      // Log the actual data structure for debugging
      console.log('Employee data received:', response.data);
      console.log('Available fields:', Object.keys(response.data));
      
      // Increment key to force transition
      employeeKey.value++;
      // Update employee data - transition will trigger due to key change
      employee.value = response.data;
      // Reset flip state when new employee is loaded
      isFlipped.value = false;
      
      // Wait for Vue to update computed properties and ensure name is ready
      await nextTick();
      
      // Keep loading true until name is ready
      // Poll briefly to ensure name computed properties have evaluated
      let attempts = 0;
      while (!isNameReady.value && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 10));
        attempts++;
      }
    } else {
      error.value = 'No employee data returned from API';
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch employee data';
    console.error('Error fetching employee:', err);
  } finally {
    loading.value = false;
  }
};

const refreshEmployee = () => {
  fetchEmployee();
};

// Format salary to include dollar sign and commas
const formatSalary = (salary: number | string | null | undefined): string => {
  if (salary === null || salary === undefined || salary === '') {
    return '$0';
  }
  const numSalary = typeof salary === 'string' ? parseFloat(salary) : salary;
  if (isNaN(numSalary)) {
    return '$0';
  }
  return `$${numSalary.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

// Get field value with fallback for different possible field name formats
const getField = (obj: any, ...possibleKeys: string[]): string => {
  for (const key of possibleKeys) {
    if (obj?.[key] !== null && obj?.[key] !== undefined && obj?.[key] !== '') {
      return String(obj[key]);
    }
  }
  return '';
};

// Properly capitalize text (converts ALL CAPS to Proper Case)
const properCase = (text: string): string => {
  if (!text) return '';
  return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

// Parse full name from "LAST NAME, FIRST NAME" format
const parseName = (fullName: string): { firstName: string; lastName: string } => {
  if (!fullName) return { firstName: '', lastName: '' };
  
  // Handle format: "LAST NAME, FIRST NAME" or "LASTNAME, FIRSTNAME"
  const parts = fullName.split(',').map(part => part.trim());
  
  if (parts.length >= 2) {
    // Format: "LAST NAME, FIRST NAME"
    const lastName = parts[0] || '';
    const firstName = parts.slice(1).join(' ') || ''; // Handle cases like "HECTOR F" or "FIRST MIDDLE"
    return {
      lastName,
      firstName
    };
  } else if (parts.length === 1 && parts[0]) {
    // No comma, try to split by space (assume "FIRST LAST")
    const spaceParts = parts[0].split(' ');
    if (spaceParts.length >= 2) {
      const firstName = spaceParts[0] || '';
      const lastName = spaceParts.slice(1).join(' ') || '';
      return {
        firstName,
        lastName
      };
    }
    return { firstName: parts[0] || '', lastName: '' };
  }
  
  return { firstName: '', lastName: '' };
};

// Computed properties for employee data
const fullName = computed(() => {
  return getField(
    employee.value,
    // Uppercase variations
    'NAME', 'FULL_NAME', 'EMPLOYEE_NAME', 'EMPLOYEE NAME',
    // Lowercase variations
    'name', 'full_name', 'fullName', 'employee_name', 'employeeName', 'employee name',
    // Title case variations
    'Name', 'Full Name', 'Employee Name', 'Full_Name', 'Employee_Name'
  );
});

const nameParts = computed(() => {
  return parseName(fullName.value);
});

const firstName = computed(() => {
  return properCase(nameParts.value.firstName);
});

const lastName = computed(() => {
  return properCase(nameParts.value.lastName);
});

// Check if name data is ready (used to show/hide all fields together)
const isNameReady = computed(() => {
  return !!(firstName.value || lastName.value);
});

// Combined loading state: true if loading OR if employee exists but name isn't ready
const isLoadingData = computed(() => {
  return loading.value || (employee.value && !isNameReady.value);
});

const jobTitle = computed(() => {
  const title = getField(
    employee.value,
    // Uppercase variations
    'JOB_TITLES', 'JOB_TITLE', 'JOBTITLE', 'JOB TITLES', 'JOB TITLE', 'TITLE',
    // Lowercase variations
    'job_title', 'jobTitle', 'job_titles', 'jobTitles', 'job title', 'job titles', 'title',
    // Title case variations
    'Job Title', 'Job Titles', 'Job_Title', 'Job_Titles', 'Title'
  );
  return properCase(title);
});
const department = computed(() => {
  const dept = getField(
    employee.value,
    // Uppercase variations
    'DEPARTMENT', 'DEPARTMENT_NAME', 'DEPT',
    // Lowercase variations
    'department', 'department_name', 'departmentName', 'dept',
    // Title case variations
    'Department', 'Department Name', 'Department_Name', 'Dept'
  );
  return properCase(dept);
});
const salary = computed(() => {
  // Try all possible field name variations
  const sal = employee.value?.ANNUAL_SALARY 
    || employee.value?.SALARY 
    || employee.value?.annualSalary 
    || employee.value?.annual_salary
    || employee.value?.salary
    || employee.value?.['Annual Salary']
    || employee.value?.['Annual_Salary']
    || employee.value?.['Salary'];
  return formatSalary(sal);
});

// Check if employee is hourly
const isHourly = computed(() => {
  const salaryOrHourly = getField(
    employee.value,
    // Uppercase variations
    'SALARY_OR_HOURLY', 'SALARY OR HOURLY', 'TYPE',
    // Lowercase variations
    'salary_or_hourly', 'salaryOrHourly', 'salary or hourly', 'type',
    // Title case variations
    'Salary or Hourly', 'Salary_Or_Hourly', 'Type'
  );
  if (salaryOrHourly) {
    const upperValue = salaryOrHourly.toUpperCase();
    return upperValue === 'HOURLY' || upperValue.includes('HOURLY');
  }
  return false;
});

// Format hourly rate
const formatHourlyRate = (rate: number | string | null | undefined): string => {
  if (rate === null || rate === undefined || rate === '') {
    return '$0.00';
  }
  const numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
  if (isNaN(numRate)) {
    return '$0.00';
  }
  return `$${numRate.toFixed(2)}`;
};

const hourlyRate = computed(() => {
  const rate = employee.value?.HOURLY_RATE 
    || employee.value?.['HOURLY RATE']
    || employee.value?.hourlyRate 
    || employee.value?.hourly_rate
    || employee.value?.RATE 
    || employee.value?.rate
    || employee.value?.['Hourly Rate']
    || employee.value?.['Hourly_Rate'];
  return formatHourlyRate(rate);
});

const employeeType = computed(() => {
  // Check SALARY_OR_HOURLY first to determine if employee is salaried or hourly
  const salaryOrHourly = getField(
    employee.value,
    // Uppercase variations
    'SALARY_OR_HOURLY', 'SALARY OR HOURLY', 'TYPE',
    // Lowercase variations
    'salary_or_hourly', 'salaryOrHourly', 'salary or hourly', 'type',
    // Title case variations
    'Salary or Hourly', 'Salary_Or_Hourly', 'Type'
  );
  
  if (salaryOrHourly) {
    const upperValue = salaryOrHourly.toUpperCase();
    if (upperValue === 'SALARY' || upperValue.includes('SALARY')) {
      return 'Salaried Employee';
    }
    if (upperValue === 'HOURLY' || upperValue.includes('HOURLY')) {
      return 'Hourly Employee';
    }
  }
  
  // Fallback to Full or Part-Time if SALARY_OR_HOURLY is not available
  const fullOrPartTime = getField(
    employee.value,
    // Uppercase variations
    'FULL_OR_PART_TIME', 'FULL OR PART TIME', 'FULL_OR_PART-TIME',
    // Lowercase variations
    'full_or_part_time', 'fullOrPartTime', 'full or part-time', 'full or part time',
    // Title case variations
    'Full or Part-Time', 'Full_Or_Part_Time', 'Full or Part Time'
  );
  if (fullOrPartTime) {
    return fullOrPartTime === 'F' ? 'Full-Time' : fullOrPartTime === 'P' ? 'Part-Time' : properCase(fullOrPartTime);
  }
  
  // Final fallback to other possible field names
  const type = getField(
    employee.value,
    // Uppercase variations
    'EMPLOYEE_TYPE', 'EMPLOYEE_TYPE_NAME', 'EMPLOYEE TYPE',
    // Lowercase variations
    'employee_type', 'employeeType', 'employee_type_name', 'employeeTypeName', 'employee type',
    // Title case variations
    'Employee Type', 'Employee_Type', 'Employee Type Name', 'Employee_Type_Name'
  );
  return properCase(type);
});

onMounted(() => {
  fetchEmployee();
});
</script>

<style lang="css" scoped>
  .employee-name {
    font-family: "Big Shoulders Display", sans-serif;
  }

  .card-container {
    perspective: 1000px;
    position: relative;
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    transition: transform 0.8s;
    transform-style: preserve-3d;
  }

  .card-front {
    transform: rotateY(0deg);
  }

  .card-back {
    transform: rotateY(180deg);
  }

  .card-container.flipped .card-front {
    transform: rotateY(-180deg);
  }

  .card-container.flipped .card-back {
    transform: rotateY(0deg);
  }

  /* Fade transition for employee data */
  .fade-enter-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .fade-leave-active {
    transition: opacity 0.1s ease, transform 0.1s ease;
  }

  .fade-enter-from {
    opacity: 0;
    transform: translateY(-4px);
  }

  .fade-leave-to {
    opacity: 0;
    transform: translateY(4px);
  }
</style>

