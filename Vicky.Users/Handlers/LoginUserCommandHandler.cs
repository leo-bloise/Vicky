using Vicky.Common;
using Vicky.Common.Exceptions;
using Vicky.Users.Commands;
using Vicky.Users.Repositories;
using Vicky.Users.Services;

namespace Vicky.Users.Handlers;

public class LoginUserCommandHandler(IUserRepository userRepository, ICryptoService cryptoService, IJwtTokenService service): ICommandHandler<LoginUserCommand, Token>
{
    public Token Handle(LoginUserCommand request)
    {
        User user = userRepository.FindByUsername(request.Username) ?? throw new DomainException("Invalid credentials");

        if(!cryptoService.Compare(user, request.Password)) throw new DomainException("Invalid credentials");

        return service.GenerateToken(user);
    }
}