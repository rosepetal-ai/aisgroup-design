<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import PlayerBar from '../../templates/explainer/vendor/aisgroup/design/blocks/PlayerBar.vue';
import { mountStation } from './scene';
import mark from './ais-vision-systems-blue.svg?url';
import { duration } from '../packing-transfer/motion.mjs';

const transfer=new URLSearchParams(location.search).get("station")!=="cabinet";
const phase=(t:number)=>transfer?(t<.25?"The carton rests on the deck.":t<2.48?"The cylinder presents the carton.":t<4.28?"Both hands take the load.":t<6.27?"The operator lifts and carries the carton.":t<7.28?"The receiving tray takes the load.":"The operator releases the carton."):(t<2?"The cabinet is on standby.":t<6?"The green lens shows that the cell is running.":"The run light goes out when the cell stops.");
const captions=ref(true);
const canvas=ref<HTMLCanvasElement>(),time=ref(0),playing=ref(false),speed=ref(1),view=ref('line'),full=ref(false),ready=ref(false),error=ref('');
const chapters=transfer?[{at:0,name:'Transfer'},{at:2.48,name:'Grasp'},{at:4.28,name:'Carry'},{at:6.27,name:'Set down'}]:[{at:0,name:'Standby'},{at:2,name:'Run'},{at:6,name:'Stop'}];
const views=[{id:'line',name:'Station'},{id:'detail',name:transfer?'Handoff':'Signal tower'}];
let scene:Awaited<ReturnType<typeof mountStation>>, frame=0,previous=0,disposed=false,resize:ResizeObserver;
function draw(){scene?.draw(time.value,view.value);}
function seek(t:number){time.value=Math.max(0,Math.min(duration,t));draw();}
function tick(now:number){
  if(!playing.value)return;
  seek(time.value+(now-previous)*speed.value/1000);previous=now;
  if(time.value>=duration)playing.value=false;else frame=requestAnimationFrame(tick);
}
watch(playing,on=>{cancelAnimationFrame(frame);if(on){if(time.value>=duration)seek(0);previous=performance.now();frame=requestAnimationFrame(tick);}});
watch(view,draw);
const fullscreen=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();
const syncFull=()=>{full.value=!!document.fullscreenElement};
onMounted(async()=>{
  try{
    scene=await mountStation(canvas.value!,transfer);
    if(disposed){scene.dispose();return;}
    resize=new ResizeObserver(draw);resize.observe(canvas.value!);draw();ready.value=true;
    document.addEventListener('fullscreenchange',syncFull);
    if(import.meta.env.DEV || (location.protocol==="file:" && new URLSearchParams(location.search).has("review")))Object.assign(window,{stationReview:{measure:scene.measure,inspect:scene.inspect,seek}});
  }catch{error.value='The 3D station could not load.';}
});
onBeforeUnmount(()=>{disposed=true;cancelAnimationFrame(frame);resize?.disconnect();scene?.dispose();document.removeEventListener('fullscreenchange',syncFull);});
</script>
<template>
  <canvas ref="canvas"  :aria-label="transfer?'A guided cylinder presents a carton for the operator to move to the receiving bay.':'Control cabinet showing the running state on its signal tower.'"/>
  <img class="identity" :src="mark" alt="AIS Vision Systems"/>
  <h1 v-if="view==='line' && time<1.65" class="opening" data-scene-opening :style="{opacity:Math.max(0,Math.min(1,(1.65-time)/.5))}">{{ transfer ? 'Carton transfer' : 'Signal tower' }}</h1>
  <footer>
    <p v-show="captions || !ready" class="phase" data-scene-caption role="status"><span>{{ error || (ready ? phase(time) : 'Loading station…') }}</span></p>
    <PlayerBar v-if="ready" v-model:captions="captions" v-model:playing="playing" v-model:speed="speed" v-model:view="view" :time="time" :duration="duration" :chapters="chapters" :views="views" :is-fullscreen="full" @seek="seek" @fullscreen="fullscreen"/>
  </footer>
</template>
