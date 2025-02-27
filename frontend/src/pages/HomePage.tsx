import { useQuery, useQueries, useMutation } from "@tanstack/react-query";
import { apiClient } from "../Connection"; 
import { Link } from "react-router-dom";


// https://ts-rest.com/docs/react-query/v4
const HomePage = () => {

  // const { data, isLoading, error } = apiClient.hello.get.useQuery(['hello']);

  // useQuery hook to get data from /hello
  const { data, isLoading, error } = apiClient.hello.useQuery(
    ["hello"], // <- queryKey
    {}, // <- Query params, Params, Body etc (all typed)
  );

  // const { mutate, isLoading } = apiClient.hello.useMutation();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", paddingTop: "10rem" }}>
        <h1 style={{ fontSize: "1.5rem", color: "#6c757d" }}>
          Loading...
        </h1>
      </div>
    );
    // return <h1 style={{
    //   textAlign: "center",
    //   fontSize: "1.5rem",
    //   color: "#6c757d",
    //   marginTop: "2rem"
    // }}>Loading...</h1>;
  }

  if (data?.status !== 200) {
    console.log("error");
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", minHeight: "100vh", paddingTop: "10rem" }}>
        <h1 style={{ fontSize: "1.5rem", color: "#dc3545" }}>
          Connection error
        </h1>
      </div>
    );
    // console.log("error");
    // return <h1 style={{
    //   textAlign: "center",
    //   fontSize: "1.5rem",
    //   color: "#dc3545",
    //   marginTop: "2rem"
    // }}>Connection error</h1>;
  }

  return (
    <div style={{
      maxWidth: "56rem",
      margin: "0 auto",
      padding: "2rem",
      backgroundColor: "white",
      boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
      borderRadius: "0.5rem",
      border: "1px solid rgba(0, 0, 0, 0.1)",
      animation: "fadeIn 0.5s ease-in-out"
    }}>
      <h1 style={{
        fontSize: "2.5rem",
        color: "#343a40",
        marginBottom: "1rem",
        fontWeight: "700"
      }}>ByteSized Reads</h1>
      <p style={{
        fontSize: "1.25rem",
        color: "#495057",
        marginTop: "1rem",
        lineHeight: "1.6"
      }}>{data?.body?.message || "Backend connection failed"}</p>
      <div style={{
        marginTop: "2rem",
        display: "flex",
        justifyContent: "center"
      }}>
        <button style={{
          backgroundColor: "#4263eb",
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.375rem",
          border: "none",
          fontSize: "1rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.2s ease",
          boxShadow: "0 4px 6px rgba(66, 99, 235, 0.2)"
        }}>Get Started</button>
      </div>
    </div>
  );
};

export default HomePage;

