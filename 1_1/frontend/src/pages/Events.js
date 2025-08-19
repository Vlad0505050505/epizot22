import { useLoaderData, Await } from "react-router-dom";
import EventsList from "../components/EventsList";
import { Suspense } from "react";

function EventsPage() {
  const {events} = useLoaderData();
//   if(data.isError){
//     return <p>{data.message}</p>
//   }
  // const events = data.events;
  // return <EventsList events={events} />;

  return (<Suspense fallback ={<p>Loading ...</p>}>
  <Await resolve={events}>
    {(loadedEvents) => <EventsList events={loadedEvents}/>}
  </Await>
  </Suspense>
);
}

export default EventsPage;
async function loadIvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
        // return{isError:true , message:"Could not fetch"}
        throw new Response(JSON.stringify({message:'Coud not fetch',status:500}));
        // return json({message:'Coud not fetch'},{status:500});
  } else {
    const resData = await response.json();
    return resData.events;
  }
}
export async function loader() {
  return {
    events:loadIvents(),
  };
}

