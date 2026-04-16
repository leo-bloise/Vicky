FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .

RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore Vicky.API/Vicky.API.csproj

RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet publish Vicky.API/Vicky.API.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_HTTP_PORTS=8080

EXPOSE 8080

USER app

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Vicky.API.dll"]