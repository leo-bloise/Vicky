namespace Vicky.Users.Handlers;

using Vicky.Common;
using Vicky.Common.Exceptions;
using Vicky.Users.Commands;
using Vicky.Users.Repositories;
using Vicky.Users.Services;

public class CreateUserCommandHandler(
    IUserRepository userRepository,
    ICryptoService cryptoService,
    IVickyLoggerFactory loggerFactory
) : ICommandHandler<CreateUserCommand, User> {

    private readonly IVickyLogger<CreateUserCommandHandler> _logger = loggerFactory.CreateLogger<CreateUserCommandHandler>();

    public User Handle(CreateUserCommand request)
    {
        _logger.LogInformation("Attempting to create user with username {Username}", request.Username);

        if(userRepository.ExistsByUsername(request.Username))
        {
            _logger.LogWarning("User creation failed: Username {Username} already exists", request.Username);

            DomainException exception = new DomainException("Username already taken");   
            
            exception.Add("Username", "Username already taken");

            throw exception;
        };

        User user = new User(
            Guid.NewGuid(),
            request.Username,
            string.Empty
        );

        string encryptedPassword = cryptoService.Encrypt(user, request.Password);

        user.Password = encryptedPassword;

        var savedUser = userRepository.Save(user);

        _logger.LogInformation("User {Username} created successfully with ID {UserId}", savedUser.Username, savedUser.Id);

        return savedUser;
    }

}