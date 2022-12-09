const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloServerPluginLandingPageGraphQLPlayground } = require('@apollo/server-plugin-landing-page-graphql-playground');

const { users, events, participants, locations } = require("./data");

const typeDefs = `#graphql
  
  type User {
    id: ID
    username: String
    email: String
    
  }

  type Event {
    id: ID
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: Int
    user_id: Int
    user: User
    participant: Participant
    location: Location
  }

  type Participant {
    id : ID
    user_id: ID
    event_id: ID
  }

  type Location {
    id: ID
    name: String
    desc: String
  }

  type Query {
    users: [User]
    user(id:ID) : User

    
    events: [Event]
    event(id: ID) : Event

    
    participants: [Participant]
    participant(id: ID): Participant

    
    
    locations: [Location]
    location(id: ID): Location
  }
`;


const resolvers = {
    Query: {
     
      users: () => users,
      user: (parent, args) => {
        const user = users.find( ( user ) => user.id == args.id );
        if (!user) {return new Error("Data Not Found!")};
        return user;
      },


      events: () => events,
      event: (parent, args) => {
        const event = events.find( ( event ) => event.id == args.id );
        if (!event) {return new Error("Data Not Found!")};
        return event;

      },

      participants: () => participants,
      participant: (parent, args) => {
        const participant = participants.find( ( participant ) => participant.id == args.id );
        if (!participant) {return new Error("Data Not Found!")};
        return participant;
      },

      locations: () => locations,
      location: (parent, args) => {
        const location = locations.find( ( location ) => location.id == args.id );
        if (!location) {return new Error("Data Not Found!")};
        return location;
      }
    },

    Event: {
        user: (parent) => users.find( ( user ) => user.id == parent.user_id ),
        participant: (parent) => participants.find( ( participant ) => participant.user_id == parent.user_id  ),
        location: (parent) => locations.find( ( location ) => location.id == parent.user_id )
    }
  };




const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  
 
  const { url } =  startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  
  console.log(`🚀  Server ready at: ${url} ${new Date().toLocaleTimeString()}`);