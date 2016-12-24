# Gather real time clustering

## The Low-Down

Recently, people close to me have observed some clustering issues with the TTC Busses. There exist high-demand routes where busses are supposed to arrive within ten minutes. However being the periphery of the TTC, and the traffic on this road being particularly bad, the busses have a tendency to cluster instead, leaving service gaps of up to 40-minutes from stories. 

This app is being developed to prove the hypothesis that _"TTC Busses on the 60 route have a tendency to cluster and cause service disruption at a systematic level_". 

I intend the stack to be Node with Express or Koa, PostGres with PostGIS. 

## Stages

1. Determine End Points of the TTC Real-Time Feed
2. Create back-end Framework that scrapes feed on command
3. Create back-end feed that scrapes feed at certain times of day without user interaction
4. Determine whether systematic clustering is ongoing
5. Seek assistance from a Civic Tech community in both design of dataviz, bringing awareness to the issue (if there is one)
6. Create dataviz
7. Bring to attention at certain levels. 

## Disclaimer. 

I'm usually a rails dev, so making this happen will be tricky for me. It will be new. I'm always happy to get assistance where I can, but I may get cranky based on whatever technical problem I'm trying to solve. Don't worry, it's not you as you're a pretty awesome fellow.



