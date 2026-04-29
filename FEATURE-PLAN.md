# Accounting Statement Processor

As a user, I want to import CSV files containing bank transactions so that they can be automatically processed and integrated into the Vicky application.

## 1. Objective
Enable the system to receive, store, and asynchronously process bank account statements from various providers (e.g., Nubank, Itaú, C6).

## 2. Acceptance Criteria
- **File Upload**:
    - Supports CSV format only.
    - Files are persisted in a dedicated `uploads` directory.
    - Empty or malformed files return a **422 Unprocessable Entity** response.
- **Asynchronous Processing**:
    - Upon successful upload, the system returns **202 Accepted** with a unique Job ID.
    - Processing occurs in the background via a Hosted Service.
- **Provider Support**:
    - Initial support for **Nubank**.
    - Flexible architecture to support future providers via URL parameters.
- **Resilience**:
    - Large files are processed using Streams to minimize memory footprint.

## 3. API Specification

### POST `/api/AccountStatement/{provider}`
Uploads a bank statement for processing.

- **URL Parameter**: `provider` (e.g., `nubank`)
- **Request Body**: `multipart/form-data` containing the CSV file.
- **Responses**:
    - `202 Accepted`: Task queued successfully.
        ```json
        { "jobId": "uuid", "message": "Processing started" }
        ```
    - `400 Bad Request`: Missing or invalid file.
    - `422 Unprocessable Entity`: File is empty or not a valid CSV.

## 4. Technical Architecture

### 4.1 Storage Layer (`Vicky.ObjectStorage`)
A specialized service responsible for:
- Persisting uploaded files to the filesystem (`/uploads`).
- Providing a Stream-based reader for account statements.
- **Interface**: `IAccountStatementStreamReader` which yields `IAccountStatement` objects.

### 4.2 Background Worker (`AccountStatementProcessorService`)
- Implemented as a `BackgroundService` (IHostedService).
- Uses `System.Threading.Channels` for the internal message queue (preferred over `ConcurrentQueue` for better async support).
- **Message Schema**:
    - `JobId`: Unique identifier (UUID).
    - `UserId`: ID of the user who uploaded the file.
    - `FilePath`: Absolute path to the stored CSV.
    - `Provider`: Enum mapping to the bank provider.

### 4.3 Domain Abstractions
- **`IAccountStatement`**: Represents a single transaction from a statement.
- **`IAccountStatementParser`**: Strategy interface for parsing different CSV formats.
- **`AccountStatementParserFactory`**: Resolves the correct parser based on the `provider` string.

## 5. Implementation Phases

### Phase 1: Infrastructure & Contract
- Define `IAccountStatement` and provider interfaces.
- Implement the basic `ObjectStorage` service in `Vicky.API`.
- Create the `uploads` directory structure.

### Phase 2: API & Background Service
- Implement `AccountStatementController` with file upload logic.
- Set up the `BackgroundService` and the processing channel.
- Implement basic logging of processed rows.

### Phase 3: Provider Logic (Nubank)
- Implement `NubankAccountStatementParser`.
- Add validation logic for Nubank-specific columns: `Data`, `Valor`, `Identificador`, `Descricao`.

## 6. Verification
- **Unit Tests**: Parser logic for different CSV formats.
- **Integration Tests**: File upload endpoint and background worker orchestration.
- **Manual Test**: Upload a 10MB+ Nubank CSV and monitor logs for successful processing.

If you want to, you can read the file /home/bloise/Downloads/NU_389768679_01ABR2026_18ABR2026.csv to get a real sample of data provided by NUbank.