import express from "express";

declare global {
  namespace Express {
    interface Request {
      indicatorQueryData?: Record<string,any>
    }
  }
}
