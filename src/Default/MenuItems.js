export function getMenuItems(selectedTask)
{
  if ('learn/bowexercises' === selectedTask) 
    return [{key:'100', name:'Hold the bow', enabled:true}, {key:'101', name:'Spider Crawl', enabled:true}, {key:'102', name:'The Window Cleaner', enabled:true}]
  else if('learn/posture' === selectedTask)
    return [{key:'200', name:'Holding Violin', enabled:true}, {key:'201', name:'Bow Hand Position', enabled:true}, {key:'202', name:'Bowing', enabled:true}]
  else if('learn/playalong' === selectedTask)
    return [
            {key:'300', name:'Twinkle Twinkle Star', enabled:true}, 
            {key:'301', name:'Lightly Row', enabled:true}, 
            {key:'302', name:'Song Of The Wind', enabled:false},
            {key:'303', name:'Go Tell Aunt Rohdy', enabled:false},
            {key:'304', name:'O Come Little Children', enabled:false},
            {key:'305', name:'May Song', enabled:false},
            {key:'306', name:'Long Long Ago', enabled:false},
            {key:'307', name:'Allegro', enabled:false},
            {key:'308', name:'Perpetual Motion', enabled:false},
            {key:'309', name:'Allegretto', enabled:false},
            {key:'310', name:'Andantino', enabled:false},
            {key:'311', name:'(+) Add New Music to Library', enabled:true}

          ]
    else if('learn/recordings' === selectedTask)
      return [
              {key:'400', name:'Twinkle Twinkle Star (03-01-2022 09:30:12 PM)', enabled:true}, 
              {key:'401', name:'Twinkle Twinkle Star (02-28-2022 09:20:02 PM)', enabled:true}, 
              {key:'402', name:'Lightly Row  (02-28-2022 09:16:14 PM)', enabled:true},
              {key:'403', name:'Twinkle Twinkle Star (02-28-2022 09:10:32 PM)', enabled:true}, 
              {key:'404', name:'Twinkle Twinkle Star (02-28-2022 09:00:04 PM)', enabled:true}, 
                ]
      }