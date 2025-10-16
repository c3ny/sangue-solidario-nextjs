# API Service Documentation

## Overview

The API Service provides a structured and type-safe way to communicate with backend microservices. All responses follow a consistent structure for both success and error cases.

## Response Structure

### Success Response

```typescript
interface IAPISuccessResponse<T> {
  status: number; // HTTP status code (200, 201, etc.)
  message: string; // Success message
  data: T; // Response data (typed)
}
```

### Error Response

```typescript
interface IAPIErrorResponse {
  status: number; // HTTP status code (400, 404, 500, etc.)
  message: string; // Error message
  error?: string; // Optional error type
}
```

## Type Guards

### `isAPISuccess<T>(response: IAPIResponse<T>): response is IAPISuccessResponse<T>`

Check if a response is successful.

```typescript
const response = await apiService.get<User>("/users/1");

if (isAPISuccess(response)) {
  console.log(response.data); // User data
} else {
  console.error(response.message); // Error message
}
```

### `isAPIError(response: IAPIResponse): response is IAPIErrorResponse`

Check if a response is an error.

```typescript
const response = await apiService.get("/users/1");

if (isAPIError(response)) {
  console.error(`Error ${response.status}: ${response.message}`);
}
```

## Usage Examples

### Creating a Service

```typescript
import { APIService, isAPISuccess } from "@/service/api/api";

export interface User {
  id: number;
  name: string;
  email: string;
}

class UserService extends APIService {
  async getUser(id: number): Promise<User | null> {
    const url = this.getUsersServiceUrl(`users/${id}`);
    const response = await this.get<User>(url);

    if (isAPISuccess(response)) {
      return response.data;
    }

    console.error("Failed to fetch user:", response.message);
    return null;
  }

  async createUser(userData: Partial<User>): Promise<User | null> {
    const url = this.getUsersServiceUrl("users");
    const response = await this.post<User>(url, userData);

    if (isAPISuccess(response)) {
      return response.data;
    }

    console.error("Failed to create user:", response.message);
    return null;
  }
}
```

### Handling Paginated Results

```typescript
import { PaginatedResult } from "@/types/pagination.types";

class DonationsService extends APIService {
  async getDonations(page: number = 1): Promise<PaginatedResult<Donation>> {
    const url = this.getDonationServiceUrl(`donations?page=${page}`);
    const response = await this.get<PaginatedResult<Donation>>(url);

    if (isAPISuccess(response)) {
      return response.data;
    }

    // Return empty result on error
    return {
      data: [],
      metadata: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }
}
```

### Displaying Error Messages to Users

```typescript
async function loadUserData(userId: number) {
  const response = await userService.getUser(userId);

  if (response === null) {
    // Error already logged by service
    setErrorMessage("Failed to load user data. Please try again.");
    return;
  }

  setUserData(response);
}
```

### Advanced Error Handling

```typescript
class OrderService extends APIService {
  async createOrder(orderData: OrderData): Promise<Order | null> {
    const url = this.getDonationServiceUrl("orders");
    const response = await this.post<Order>(url, orderData);

    if (isAPISuccess(response)) {
      return response.data;
    }

    // Handle specific error cases
    if (response.status === 400) {
      console.error("Invalid order data:", response.message);
    } else if (response.status === 401) {
      console.error("Authentication required");
      // Redirect to login
    } else if (response.status === 500) {
      console.error("Server error:", response.message);
    }

    return null;
  }
}
```

## Best Practices

### 1. Always Handle Both Success and Error Cases

```typescript
// ✅ Good
const response = await service.getData();
if (isAPISuccess(response)) {
  return response.data;
}
console.error("Error:", response.message);
return null;

// ❌ Bad - assumes success
const response = await service.getData();
return response.data; // Will crash on error
```

### 2. Provide Fallback Values

```typescript
// ✅ Good
async getDonations(): Promise<PaginatedResult<Donation>> {
  const response = await this.get<PaginatedResult<Donation>>(url);

  if (isAPISuccess(response)) {
    return response.data;
  }

  // Return safe fallback
  return {
    data: [],
    metadata: { page: 1, limit: 10, total: 0, totalPages: 0 },
  };
}
```

### 3. Log Errors for Debugging

```typescript
if (!isAPISuccess(response)) {
  console.error("API Error:", {
    status: response.status,
    message: response.message,
    url: url,
  });
}
```

### 4. Type Your Response Data

```typescript
// ✅ Good - typed response
const response = await this.get<User>(url);

// ❌ Bad - untyped
const response = await this.get(url);
```

## Error Scenarios

The API service handles several error scenarios:

1. **HTTP Errors (4xx, 5xx)**: Returns error response with status and message
2. **Network Errors**: Returns error response with status 0 and "NETWORK_ERROR"
3. **JSON Parse Errors**: Handled gracefully with default error messages
4. **Timeout Errors**: Caught and returned as network errors

## Migration Guide

If you're updating existing code to use the new API structure:

### Before

```typescript
async getDonations() {
  const url = this.getDonationServiceUrl("donations");
  return this.get(url); // Returns data directly or throws
}
```

### After

```typescript
async getDonations(): Promise<PaginatedResult<Donation>> {
  const url = this.getDonationServiceUrl("donations");
  const response = await this.get<PaginatedResult<Donation>>(url);

  if (isAPISuccess(response)) {
    return response.data;
  }

  console.error("Failed to fetch donations:", response.message);
  return { data: [], metadata: { page: 1, limit: 10, total: 0, totalPages: 0 } };
}
```

## Testing

When writing tests, you can mock API responses easily:

```typescript
const mockSuccessResponse: IAPISuccessResponse<User> = {
  status: 200,
  message: "Request successful",
  data: { id: 1, name: "John", email: "john@example.com" },
};

const mockErrorResponse: IAPIErrorResponse = {
  status: 404,
  message: "User not found",
  error: "NOT_FOUND",
};
```

## Environment Variables

Make sure to set the following environment variables:

```env
DONATION_SERVICE_URL=localhost:3001
USERS_SERVICE_URL=localhost:3002
```

## Support

For issues or questions about the API service:

1. Check the examples in this file
2. Review the TypeScript interfaces in `src/service/api/api.ts`
3. Look at existing service implementations in `src/features/*/services/`
