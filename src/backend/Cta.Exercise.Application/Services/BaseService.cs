using Cta.Exercise.Application.Mappers;
using Cta.Exercise.Core.Dtos;
using Cta.Exercise.Core.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Cta.Exercise.Application.Services;

public class BaseService : IBaseService
{
    private readonly IBaseRepository _repository;

    public BaseService(IBaseRepository repository)
    {
        _repository = repository;
    }

    public ActionResult<U> Create<T, U>(T entity) where T : BaseCreateDto where U : BaseGetDto
    {
        if (entity == null)
        {
            return new BadRequestResult();
        }

        // Map the create DTO to an entity
        var baseEntity = BaseMapper.Map(entity);
        if (baseEntity == null)
        {
            return new BadRequestResult();
        }

        // Add the entity to the repository
        _repository.Add(baseEntity);

        // Map the entity back to a GetDto
        var dto = BaseMapper.Map(baseEntity) as U;
        return new OkObjectResult(dto);
    }

    public ActionResult<string> Delete(string id)
    {
        _repository.Delete(id);
        return new OkObjectResult(id);
    }

    public ActionResult<T?> GetById<T>(string id) where T : BaseGetDto
    {
        var entity = _repository.GetById(id);
        if (entity == null)
        {
            return new NotFoundResult();
        }
        var dto = BaseMapper.Map(entity) as T;
        return new OkObjectResult(dto);
    }

    public ActionResult<List<T?>> GetByType<T>() where T : BaseGetDto
    {
        var entities = _repository.GetByType(BaseGetDto.GetTypeByConstraint(typeof(T)));
        var dtos = entities.Select(x => BaseMapper.Map(x) as T).ToList();

        return new OkObjectResult(dtos);
    }

    public ActionResult<U> Update<T, U>(string id, T entity)
        where T : BaseUpdateDto
        where U : BaseGetDto
    {
        throw new NotImplementedException();
    }
}
