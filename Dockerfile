
FROM mcr.microsoft.com/dotnet/runtime-deps:6.0-alpine AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine AS build
ENV BuildingDocker true
WORKDIR /src
COPY ["Tuchka.csproj", ""]
RUN dotnet restore "Tuchka.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "Tuchka.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Tuchka.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
CMD ASPNETCORE_URLS=http://*:$PORT dotnet Tuchka.dll