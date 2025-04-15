import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		if (authUser) {
			const socket = io("https://mern-chat-app-9z0o.onrender.com", {
				query: {
					userId: authUser._id,
				},
				transports: ["websocket"],
				withCredentials: true
			});

			setSocket(socket);

			// socket.on() is used to listen to the events. can be used both on client and server side
			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};

// import { createContext, useState, useEffect, useRef, useContext } from "react";
// import { useAuthContext } from "./AuthContext";
// import io from "socket.io-client";

// const SocketContext = createContext();

// export const useSocketContext = () => {
// 	return useContext(SocketContext);
// };

// export const SocketContextProvider = ({ children }) => {
// 	const [onlineUsers, setOnlineUsers] = useState([]);
// 	const { authUser } = useAuthContext();
// 	const socketRef = useRef(null); // <-- useRef to persist across renders

// 	useEffect(() => {
// 		if (authUser) {
// 			socketRef.current = io("https://mern-chat-app-9z0o.onrender.com", {
// 				query: { userId: authUser._id },
// 				transports: ["websocket"],
// 				withCredentials: true
// 			});

// 			socketRef.current.on("getOnlineUsers", (users) => {
// 				setOnlineUsers(users);
// 			});
// 		}

// 		return () => {
// 			if (socketRef.current) {
// 				socketRef.current.close();
// 				socketRef.current = null;
// 			}
// 		};
// 	}, [authUser]);

// 	return (
// 		<SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
// 			{children}
// 		</SocketContext.Provider>
// 	);
// };
