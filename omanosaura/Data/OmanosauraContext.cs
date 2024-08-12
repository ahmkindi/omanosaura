using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using omanosaura.Models;

namespace Omanosaura.Data
{
  public class OmanosauraContext : DbContext
  {
    public OmanosauraContext(DbContextOptions<OmanosauraContext> options)
        : base(options)
    {
    }

    public DbSet<omanosaura.Models.Trip> Trip { get; set; } = default!;
    public DbSet<omanosaura.Models.StartEndDate> StartEndDate { get; set; } = default!;
  }
}
