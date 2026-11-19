/**
 * Illustrative example expressly requested by Julio to match his supplied video.
 * NOT a live valuation nor the prior real VMC consultation.
 * Video: Toyota RAV4 2020 automatic60,000km;20,620 range19,180–22,680;
 * 1m20,100;3m20,450;6m20,730;12m19,780;January+13.1%,Jan/Feb/Sep.
 * Trim unspecified in video: omitted. Signal not shown: illustrative No es
 * momento1/5 chosen consistent with November low season and next January peak.
 * Monthly factors modeled from the VMC pattern, peak rounded13.1 to match video;
 * NOT exact monthly factors from video's unlabelled bars.
 * Intermediate curve points are an authorized visual simulation of video frame 29,
 * not numerical data extracted from VMC. Five labelled milestones remain exact.
 */
export const VMC_EXAMPLE = {
 source:"Ejemplo ilustrativo basado en el video de Julio",
 vehicle:"Toyota RAV4 2020 · Automático · 60,000 km",
 market:20620,
 range:[19180,22680],
 milestones:[{month:0,value:20620},{month:1,value:20100},{month:3,value:20450},{month:6,value:20730},{month:12,value:19780}],
 curve:[{month:0,value:20620},{month:1,value:20100},{month:1.65,value:19620},{month:2.3,value:19990},{month:3,value:20450},{month:3.5,value:20700},{month:4.6,value:20880},{month:5,value:20820},{month:5.5,value:20830},{month:6,value:20730},{month:6.6,value:20580},{month:7.5,value:19980},{month:8.5,value:19250},{month:9.2,value:19300},{month:9.7,value:19310},{month:10.5,value:19980},{month:11,value:19970},{month:11.5,value:20060},{month:12,value:19780}],
 signal:{label:"No es momento",sublabel:"Demanda baja. Mejor esperar.",level:1},
 timing:{nextPeakMonth:"Enero",peakPercent:13.1,bestMonths:["Ene","Feb","Sep"]},
 season:[13.1,13.1,8.05,8.05,8.05,-5.08,-5.08,8.05,13.1,8.05,-5.08,-5.08],
} as const;
