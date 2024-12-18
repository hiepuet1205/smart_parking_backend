// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.0.3
//   protoc               v3.12.4
// source: user/user.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface UpdateTotalRequest {
  id: number;
  total: string;
}

export interface UpdateTotalResponse {
  status: string;
}

export interface GetVehicleInfoRequest {
  id: number;
}

export interface GetVehicleInfoResponse {
  id: number;
  type: string;
  licensePlates: string;
  image: string;
}

export interface GetUserByIdRequest {
  id: number;
}

export interface GetUserByIdResponse {
  user: User | undefined;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  total: string;
  status: string;
  role: string;
  vehicles: Vehicle[];
  password: string;
}

export interface Vehicle {
  id: number;
  type: string;
  licensePlates: string;
  image: string;
}

export interface GetUserByEmailRequest {
  email: string;
}

export interface GetUserByEmailResponse {
  user: User | undefined;
}

export interface SendNotificationsRequest {
  title: string;
  body: string;
  userIds: number[];
  data: { [key: string]: string };
}

export interface SendNotificationsRequest_DataEntry {
  key: string;
  value: string;
}

export interface SendNotificationsResponse {
  status: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UserServiceClient {
  getUserById(request: GetUserByIdRequest): Observable<GetUserByIdResponse>;

  getUserByEmail(request: GetUserByEmailRequest): Observable<GetUserByEmailResponse>;

  sendNotifications(request: SendNotificationsRequest): Observable<SendNotificationsResponse>;

  getVehicleInfo(request: GetVehicleInfoRequest): Observable<GetVehicleInfoResponse>;

  updateTotal(request: UpdateTotalRequest): Observable<UpdateTotalResponse>;
}

export interface UserServiceController {
  getUserById(
    request: GetUserByIdRequest,
  ): Promise<GetUserByIdResponse> | Observable<GetUserByIdResponse> | GetUserByIdResponse;

  getUserByEmail(
    request: GetUserByEmailRequest,
  ): Promise<GetUserByEmailResponse> | Observable<GetUserByEmailResponse> | GetUserByEmailResponse;

  sendNotifications(
    request: SendNotificationsRequest,
  ): Promise<SendNotificationsResponse> | Observable<SendNotificationsResponse> | SendNotificationsResponse;

  getVehicleInfo(
    request: GetVehicleInfoRequest,
  ): Promise<GetVehicleInfoResponse> | Observable<GetVehicleInfoResponse> | GetVehicleInfoResponse;

  updateTotal(
    request: UpdateTotalRequest,
  ): Promise<UpdateTotalResponse> | Observable<UpdateTotalResponse> | UpdateTotalResponse;
}

export function UserServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getUserById",
      "getUserByEmail",
      "sendNotifications",
      "getVehicleInfo",
      "updateTotal",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("UserService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const USER_SERVICE_NAME = "UserService";
