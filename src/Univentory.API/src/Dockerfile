#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:3.1-buster AS build
WORKDIR /src
COPY ["Univentory.API.sln","."]
COPY ["docker-compose.dcproj","."]
COPY ["src/Univentory.API/src/Univentory.API.csproj", "src/Univentory.API/src/"]
COPY ["src/Univentory.Common/Univentory.Common.csproj", "src/Univentory.Common/"]
COPY ["src/Univentory.Services/Univentory.Services.csproj", "src/Univentory.Services/"]
COPY ["src/Univentory.DAL/Univentory.DAL.csproj", "src/Univentory.DAL/"]
COPY ["src/Univentory.Domain/Univentory.Domain.csproj", "src/Univentory.Domain/"]
COPY ["NuGet.config","."]
RUN dotnet restore Univentory.API.sln --configfile ./NuGet.config
COPY . .

FROM build AS publish
WORKDIR "/src/src/Univentory.API/src"
RUN dotnet publish --no-restore -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Univentory.API.dll"]