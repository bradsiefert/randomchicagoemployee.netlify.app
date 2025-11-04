<template>
  <div class="bg-zinc-100 box-border flex flex-col gap-4 min-[480px]:gap-6 items-center justify-center p-2 relative min-h-screen">
    <div class="flex flex-col justify-center relative text-[#121212] text-xs min-[480px]:text-sm text-center tracking-[-0.3px] px-2 w-full">
      <p class="leading-5 min-[480px]:leading-6 text-base min-[480px]:text-lg whitespace-normal min-[480px]:whitespace-pre break-words">
        Displays a random <a target="_blank" href="https://data.cityofchicago.org/" class="underline">City of Chicago</a> employee
      </p>
    </div>
    <div class="flex gap-4 min-[480px]:gap-8 items-center justify-center relative w-full" data-name="card">
      <div class="card-container w-full max-w-[calc(100%-1rem)] min-[480px]:w-[448px] h-64" :class="{ 'flipped': isFlipped }">
        <div class="card-front">
          <div class="bg-white border border-gray-300 border-solid shadow-xsh-64 relative rounded-md w-full h-full" data-name="business-card-front">
            <div class="h-full shadow-md overflow-clip relative rounded-[inherit] w-full">
              <div class="absolute flex flex-col gap-1.5 min-[480px]:gap-2 items-start left-20 min-[480px]:left-[127px] text-[#121212] top-1/2 translate-y-[-50%] right-12 min-[480px]:right-auto" data-name="name+role">
                <div class="flex flex-col employee-name font-extrabold justify-center relative tracking-[-0.2px] w-full">
                  <p class="leading-7 min-[480px]:leading-[29px] text-3xl min-[480px]:text-4xl">
                    <span class="employee-name font-extrabold">Jasmin</span> <span class="employee-name font-medium">Plascenia</span>
                  </p>
                </div>
                <div class="capitalize flex flex-col italic justify-center relative text-lg tracking-[-0.3px] w-full">
                  <p class="leading-5 min-[480px]:leading-6">Senior Administrative Assistant</p>
                </div>
              </div>
              <div class="absolute h-32 min-[480px]:h-[208px] left-4 min-[480px]:left-6 top-1/2 translate-y-[-50%] w-12 min-[480px]:w-[71px]" data-name="CHI-vertical">
                <img alt="City of Chicago Logo" class="absolute inset-0 object-center object-contain size-full" :src="imgChiVertical" />
              </div>
              <div class="absolute bottom-8 min-[480px]:bottom-[41px] capitalize flex flex-col font-medium justify-center left-20 min-[480px]:left-[127px] text-[#121212] text-base min-[480px]:text-lg tracking-[-0.3px] translate-y-1/2 right-12 min-[480px]:right-auto min-[480px]:w-[305px]" data-name="department">
                <p class="leading-5 min-[480px]:leading-6">Department Of Business Affairs And Consumer Protection</p>
              </div>
              <div class="absolute right-3 min-[480px]:right-4 top-3 min-[480px]:top-4 flex gap-2 items-center">
                <div class="size-8 min-[480px]:size-9 cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-gray-100 rounded-lg p-1" @click="refreshEmployee" data-name="UserSwitch">
                  <img alt="Change user" class="block size-full transition-opacity duration-300 hover:opacity-80" :src="imgUserSwitch" />
                </div>
                <div class="size-8 min-[480px]:size-9 cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-180 hover:bg-gray-100 rounded-lg p-1" @click="toggleFlip" data-name="ArrowsCounterClockwise">
                  <img alt="Refresh" class="block size-full transition-opacity duration-300 hover:opacity-80" :src="imgArrowsCounterClockwise" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-back">
          <div class="bg-white border border-gray-300 border-solid shadow-md relative rounded-md w-full h-full" data-name="business-card-back">
            <div class="h-full overflow-clip relative rounded-[inherit] w-full flex items-center justify-center">
              <div class="flex flex-col gap-4 items-center relative max-w-[255px] min-[480px]:max-w-none">
                <div class="flex flex-col employee-name font-extrabold justify-center relative text-[#e71a40] text-5xl min-[480px]:text-[72px] text-center tracking-tight">
                  <p class="leading-[1.2]">✶✶✶✶</p>
                </div>
                <div class="flex flex-col employee-name font-extrabold justify-center relative text-[#121212] text-3xl min-[480px]:text-4xl text-center tracking-[-0.2px]">
                  <p class="leading-[29px]">
                    <span class="employee-name font-extrabold">Jasmin</span> <span class="employee-name font-medium">Plascenia</span>
                  </p>
                </div>
                <div class="capitalize flex flex-col gap-1 items-center justify-center relative text-[#121212] text-base tracking-[-0.3px]">
                  <div>
                    <p class="leading-5 whitespace-pre">Salaried Employee</p>
                  </div>
                  <div>
                    <p class="leading-5 whitespace-pre">
                      <span>Annual Salary:</span>
                      <span>&nbsp;$65,640</span>
                    </p>
                  </div>
                </div>
              </div>
              <div class="absolute right-3 min-[480px]:right-4 top-3 min-[480px]:top-4 flex gap-2 items-center">
                <div class="size-8 min-[480px]:size-9 cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-gray-100 rounded-lg p-1" @click="refreshEmployee" data-name="UserSwitch">
                  <img alt="Change user" class="block size-full transition-opacity duration-300 hover:opacity-80" :src="imgUserSwitch" />
                </div>
                <div class="size-8 min-[480px]:size-9 cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-180 hover:bg-gray-100 rounded-lg p-1" @click="toggleFlip" data-name="ArrowsCounterClockwise">
                  <img alt="Refresh" class="block size-full transition-opacity duration-300 hover:opacity-80" :src="imgArrowsCounterClockwise" />
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
        <span> housed in Snowflake</span> | <span> Made by </span><a target="_blank" href="https://bradsiefert.com/" class="underline">this guy</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const imgChiVertical = "/chicago-logo-vertical.png";
const imgArrowsCounterClockwise = "/ArrowsCounterClockwise.svg";
const imgUserSwitch = "/UserSwitch.svg";

const isFlipped = ref(false);

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value;
};

const refreshEmployee = () => {
  // TODO: Implement employee refresh logic
};
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
</style>

