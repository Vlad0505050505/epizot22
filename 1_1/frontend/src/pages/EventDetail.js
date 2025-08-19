import { Await, redirect, useRouteLoaderData } from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";
import { Suspense } from "react";

function EventDetailPage() {
  const { event, events } = useRouteLoaderData("event-detail");
  return (
    <>
      <Suspense fallback = {<p>Load</p>}>
        <Await resolve={event}>
          {(loadEvent) => <EventItem event={loadEvent} />}
        </Await>
      </Suspense>
      <Suspense fallback = {<p>Load</p>}>
        <Await resolve={events}>
          {(loadEvents) => <EventsList events={loadEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventDetailPage;

async function loadEvent(id) {
  const response = await fetch("http://localhost:8080/events/" + id);
  console.log(response);
  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: "Coud not fetch", status: 500 })
    );
  } else {
    const resData = await response.json();
    return resData.event;
  }
}

async function loadEvents() {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // return{isError:true , message:"Could not fetch"}
    throw new Response(
      JSON.stringify({ message: "Coud not fetch", status: 500 })
    );
    // return json({message:'Coud not fetch'},{status:500});
  } else {
    const resData = await response.json();
    return resData.events;
  }
}

export async function loader({ request, params }) {
  const id = params.eventId;
  return {
    event:await loadEvent(id),
    events: loadEvents(),
  };
}

export async function action({ params, request }) {
  const eventId = params.eventId;
  const response = await fetch("http://localhost:8080/events/" + eventId, {
    method: request.method, //  мож й просто написатим делет але прокидпэм через парамс
  });
  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: "Coud not delet", status: 500 })
    );
  }
  return redirect("/events");
}
