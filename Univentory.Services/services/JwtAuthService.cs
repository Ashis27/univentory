using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using Univentory.Services.Helpers;
using Univentory.Services.interfaces;

namespace MyShop.Identity.Infrastructure.Services
{
    public class JwtAuthService : IJwtAuthServices
    {
        private readonly JwtIssuerOptions _jwtOptions;
        public JwtAuthService(IOptions<JwtIssuerOptions> jwtOptions)
        {
            _jwtOptions = jwtOptions.Value;
            ThrowIfInvalidOptions(_jwtOptions);
        }

        public async Task<Token> GenerateEncodedJWTAsync(string id, string userName, string role)
        {
            var claims = new[]
            {
                 new Claim(JwtRegisteredClaimNames.Sub, id),
                 new Claim(JwtRegisteredClaimNames.UniqueName, userName),
                 new Claim(JwtRegisteredClaimNames.NameId, id),
                 new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                 new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64),
                 new Claim(Constants.Strings.JwtClaimIdentifiers.Id, id),
                 new Claim(Constants.Strings.JwtClaimIdentifiers.Role, role)
            };

            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(
                _jwtOptions.Issuer,
                _jwtOptions.Audience,
                claims,
                _jwtOptions.NotBefore,
                _jwtOptions.Expiration,
                _jwtOptions.SigningCredentials);

            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            string refreshToken = GenerateRefreshToken();
            //bool isDataSaved = _redisCacheService.SaveRedisCacheObject(new Token(encodedJwt, (int)_jwtIssuerOptions.ValidFor.TotalSeconds, refreshToken));
            //Token test = _redisCacheService.GetObjectAsync<Token>(encodedJwt);

            return new Token(int.Parse(id), userName, encodedJwt, (int)_jwtOptions.ValidFor.TotalSeconds, refreshToken);
        }

        public async Task<ClaimsPrincipal> ValidateTokenAsync(string accessToken)
        {
            try
            {
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = _jwtOptions.Issuer,

                    ValidateAudience = true,
                    ValidAudience = _jwtOptions.Audience,

                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey)),

                    RequireExpirationTime = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };

                ClaimsPrincipal result = new ClaimsPrincipal();
                var _jit = await _jwtOptions.JtiGenerator();
                var handler = new JwtSecurityTokenHandler();
                result = handler.ValidateToken(accessToken, tokenValidationParameters, out var token);

                return result;
            }
            catch (SecurityTokenException ex)
            {
                return null;
            }
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        private static ClaimsIdentity GenerateClaimsIdentity(string id, string userName, string role)
        {
            return new ClaimsIdentity(new GenericIdentity(userName, Constants.Strings.JwtClaims.ApiAccess), new[]
            {
                new Claim(Constants.Strings.JwtClaimIdentifiers.Id, id),
                new Claim(Constants.Strings.JwtClaimIdentifiers.Role, role)
            });
        }

        /// <returns>Date converted to seconds since Unix epoch (Jan 1, 1970, midnight UTC).</returns>
        private static long ToUnixEpochDate(DateTime date)
          => (long)Math.Round((date.ToUniversalTime() -
                               new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero))
                              .TotalSeconds);

        private static void ThrowIfInvalidOptions(JwtIssuerOptions options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero)
            {
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JwtIssuerOptions.ValidFor));
            }

            if (options.SigningCredentials == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.SigningCredentials));
            }

            if (options.JtiGenerator == null)
            {
                throw new ArgumentNullException(nameof(JwtIssuerOptions.JtiGenerator));
            }
        }
    }
}
