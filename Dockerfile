FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine AS publish

WORKDIR /src    
COPY . .
RUN apk add --update nodejs npm
RUN dotnet restore "Tuchka.csproj" --runtime alpine-x64

RUN dotnet publish "Tuchka.csproj" -c Release -o /app/publish \
    --no-restore \
    --runtime alpine-x64 \
    --self-contained true

FROM mcr.microsoft.com/dotnet/runtime-deps:6.0-alpine AS final
WORKDIR /app

EXPOSE 80

COPY --from=publish /app/publish .
ENV TZ=Europe/Moscow
ENTRYPOINT [ "./Tuchka" ]
